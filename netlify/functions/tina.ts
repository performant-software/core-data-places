import { databaseClient } from '@tina/databaseClient';
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createMediaHandler } from 'next-tinacms-s3/dist/handlers';
import ServerlessHttp from 'serverless-http';
import authConfig from '@root/auth.config';
import { Session } from '@auth/core/types';
import { Auth } from '@auth/core';
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs';

dotenv.config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';
const useSSO = process.env.TINA_PUBLIC_AUTH_USE_KEYCLOAK === 'true';

async function getSession(req: Request, options = authConfig): Promise<Session | null> {
  // @ts-ignore
  options.secret ??= process.env.AUTH_SECRET
  options.trustHost ??= true
  options.providers[0].options.clientId = process.env.AUTH_KEYCLOAK_ID
  options.providers[0].options.clientSecret = process.env.AUTH_KEYCLOAK_SECRET
  options.providers[0].options.issuer = process.env.AUTH_KEYCLOAK_ISSUER

  const url = new URL(`/api/auth/session`, process.env.PUBLIC_BASE_URL)
  const response = await Auth(new Request(url, { headers: req.headers }), options)
  const { status = 200 } = response

  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}

const CustomBackendAuth = () => {
  return {
    isAuthorized: async (req, res) : Promise<{ isAuthorized: true } | { isAuthorized: false, errorCode: number, errorMessage: string }> => {
      // Validate the token here
      const session = await getSession(req, authConfig);
      if (!session || !session.user) {
        return {
          errorCode: 401,
          errorMessage: "User is unauthenticated",
          isAuthorized: false
        }
      }
      return {
        isAuthorized: true,
      }
    },
  }
}

const authProvider = isLocal
  ? LocalBackendAuthProvider()
  : useSSO
    ? CustomBackendAuth()
    : AuthJsBackendAuthProvider({
      authOptions: TinaAuthJSOptions({
        databaseClient,
        secret: process.env.NEXTAUTH_SECRET!,
        debug: true
      })
    })

const tinaBackend = TinaNodeBackend({
  authProvider,
  databaseClient
});

const mediaHandler = createMediaHandler({
  config: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },

    region: process.env.S3_REGION,
  },
  bucket: process.env.S3_BUCKET,
  mediaRoot: process.env.S3_FOLDER,
  authorized: async (req, _res) => {
    const { isAuthorized } = await authProvider.isAuthorized(req, _res);
    return isAuthorized;
  }
});

app.post('/api/tina/*', async (req, res) => {
  tinaBackend(req, res);
});

app.get('/api/tina/*', async (req, res) => {
  tinaBackend(req, res);
});


app.get('/api/s3/media', mediaHandler);

app.get('/api/s3/media/*', mediaHandler);

app.post('/api/s3/media', mediaHandler);

app.delete('/api/s3/media/:media', (req, res) => {
  req.query.media = ['media', req.params.media]
  return mediaHandler(req, res);
});

export const handler = ServerlessHttp(app);