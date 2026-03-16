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
import { Clerk, verifyToken } from '@clerk/backend';
import { enforceEditorRules } from '../tina/clerk-rbac';

dotenv.config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';
const useSSO = process.env.TINA_PUBLIC_AUTH_USE_KEYCLOAK === 'true';
const useClerk = process.env.TINA_PUBLIC_AUTH_USE_CLERK === 'true';

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

// Short-TTL cache for Clerk token verification (avoids rate limits)
const clerkTokenCache = new Map<string, { result: any, expires: number }>();
const CLERK_CACHE_TTL = 60_000; // 60 seconds

const ClerkRBACAuth = (secretKey: string) => ({
  isAuthorized: async (req: any, _res: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return { isAuthorized: false as const, errorCode: 401, errorMessage: 'No token' };

    // Check cache
    const cached = clerkTokenCache.get(token);
    if (cached && cached.expires > Date.now()) {
      Object.assign(req, cached.result);
      return { isAuthorized: true as const };
    }

    try {
      const clerk = Clerk({ secretKey });
      const session = await verifyToken(token);
      const user = await clerk.users.getUser(session.sub);
      const role = (user.publicMetadata as any)?.role || 'editor';

      const reqData = {
        __clerkRole: role,
        __clerkUserId: session.sub,
        __clerkUserName: [user.firstName, user.lastName].filter(Boolean).join(' ')
          || user.emailAddresses[0]?.emailAddress,
      };

      Object.assign(req, reqData);
      clerkTokenCache.set(token, { result: reqData, expires: Date.now() + CLERK_CACHE_TTL });

      return { isAuthorized: true as const };
    } catch (err) {
      return { isAuthorized: false as const, errorCode: 401, errorMessage: 'Invalid token' };
    }
  }
});

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
  : useClerk
    ? ClerkRBACAuth(process.env.CLERK_SECRET_KEY!)
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

app.post('/api/tina/*', async (req: any, res: any) => {
  if (useClerk) {
    const authResult = await authProvider.isAuthorized(req, res);
    if (!authResult.isAuthorized) {
      return res.status(authResult.errorCode).json({ error: authResult.errorMessage });
    }
    if (req.__clerkRole === 'editor' && req.body?.query) {
      const rejection = await enforceEditorRules(req.body, req.__clerkUserId, databaseClient);
      if (rejection) return res.status(403).json({ error: rejection });
    }
  }
  tinaBackend(req, res);
});

app.get('/api/tina/*', async (req, res) => {
  tinaBackend(req, res);
});


app.get('/api/s3/media', mediaHandler);


// This route is necessary currently as a workaround for a bug in next-tinacms-s3 
// where the folder is not prepended to the file name when uploading
app.get('/api/s3/media/*', (req, res, next) => {
  if (req.query.key) {
    req.query.key = process.env.S3_FOLDER + '/' + req.query.key;
  }
  next();
}, mediaHandler);

app.post('/api/s3/media', mediaHandler);

app.delete('/api/s3/media/:media', (req, res) => {
  req.query.media = ['media', req.params.media]
  return mediaHandler(req, res);
});

export const handler = ServerlessHttp(app);