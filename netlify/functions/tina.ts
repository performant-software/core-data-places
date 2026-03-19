import { databaseClient } from '@tina/databaseClient';
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createMediaHandler } from 'next-tinacms-s3/dist/handlers';
import ServerlessHttp from 'serverless-http';
import { AuthJsBackendAuthProvider, TinaAuthJSOptions } from 'tinacms-authjs';
import { Clerk } from '@clerk/backend';
import type { IncomingMessage, ServerResponse } from 'http';

dotenv.config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';
const useSSO = process.env.TINA_PUBLIC_AUTH_USE_SSO === 'true';

const ClerkBackendAuthentication = ({
  secretKey,
  allowList,
  orgId,
}: {
  secretKey: string;
  // Ensure the user is the in allowList
  allowList?: string[];
  // Ensure the user is a member of the provided orgId
  orgId?: string;
}) => {
  const clerk = Clerk({
    secretKey,
  });

  return {
    isAuthorized: async (req: IncomingMessage, _res: ServerResponse) => {
      const token = req.headers['authorization'];
      const tokenWithoutBearer = token?.replace('Bearer ', '').trim();
      const requestState = await clerk.authenticateRequest({
        headerToken: tokenWithoutBearer,
      });

      if (requestState.status === 'signed-in') {
        const user = await clerk.users.getUser(requestState.toAuth().userId);
        if (orgId) {
          // Get the list of member id's for the organization
          const membershipList = (
            await clerk.organizations.getOrganizationMembershipList({
              organizationId: orgId,
            })
          );
          console.log(membershipList, user);
          const orgUser = membershipList?.find((mem) => (mem.publicUserData?.userId === user.id));
          // if the user is not in the list, they are not authorized
          if (!orgUser) {
            return {
              isAuthorized: false as const,
              errorMessage:
                `User ${user.id} not authorized. Not a member of the provided organization (${orgId}).`,
              errorCode: 401,
            };
          }
          // otherwise, add the role to the user object
          user.role = orgUser.role;
        }
        // if the user's email is not in the allowList, they are not authorized
        const primaryEmail = user.emailAddresses.find(
          ({ id }) => id === user.primaryEmailAddressId
        );

        if ((primaryEmail && !allowList) || (primaryEmail && allowList?.includes(primaryEmail.emailAddress))) {
          // now we've passed the first hurdle and it's time to check the specific permissions
          // if the user is an admin, this is all we needed to know
          if (user.role === 'org:admin') {
            return { isAuthorized: true as const };
          }
          // non-admin users can only edit paths and posts
          if (req.body?.variables?.collection && !(req.body?.variables?.collection === 'post' || req.body?.variables?.collection === 'path')) {
            return {
              isAuthorized: false as const,
              errorMessage: 'You do not have access to this collection.',
              errorCode: 401,
            };
          }
          // non-admin users can only edit paths and posts they created
          for (const collection of ['path', 'post']) {
            if (req.body?.variables?.params && req.body?.variables?.params[collection]?.creator?.id !== user.id) {
              return {
                isAuthorized: false as const,
                errorMessage: 'You may only edit content you created.',
                errorCode: 401,
              };
            }
          }
          return { isAuthorized: true as const };
        }
      }

      if (requestState.reason === 'unexpected-error') {
        console.error(requestState.message);
      }
      return {
        isAuthorized: false as const,
        errorMessage: 'User not authorized',
        errorCode: 401,
      };
    },
  };
};

const authProvider = isLocal
  ? LocalBackendAuthProvider()
  : useSSO
    ? ClerkBackendAuthentication({
      secretKey: process.env.CLERK_SECRET,
      orgId: process.env.TINA_PUBLIC_CLERK_ORG_ID
    })
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