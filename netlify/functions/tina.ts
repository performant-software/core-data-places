import { databaseClient } from '@tina/databaseClient';
import { TinaNodeBackend, LocalBackendAuthProvider } from '@tinacms/datalayer';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { createMediaHandler } from 'next-tinacms-s3/dist/handlers';
import ServerlessHttp from 'serverless-http';
import { createClerkClient } from '@clerk/backend'
import type { IncomingMessage, ServerResponse } from 'http';

try { process.loadEnvFile(); } catch {}

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(cookieParser());

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

if (!isLocal && !process.env.CLERK_SECRET) {
  throw new Error(
    'Clerk SSO is required for deployed CDP sites (since v1.9.0). Set CLERK_SECRET (plus TINA_PUBLIC_CLERK_PUBLIC_KEY and TINA_PUBLIC_CLERK_ORG_ID). See docs/upgrade-notes.md.'
  );
}

// convert an IncomingMessage to a Request to make Clerk happy
function toFetchRequest(req: IncomingMessage): Request {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || 'localhost';
  const url = `${protocol}://${host}${req.url || '/'}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value != null) {
      headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    }
  }

  return new Request(url, { method: req.method || 'GET', headers });
}

// next-tinacms-s3 expects a modified request object, but Express 5 officially removed
// the ability to mutate the request directly. this is a fairly ugly workaround.
function patchQuery(req: express.Request, overrides: Record<string, unknown>) {
  const query = { ...req.query, ...overrides };
  Object.defineProperty(req, 'query', {
    value: query,
    writable: true,
    configurable: true,
  });
}

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
  const clerk = createClerkClient({
    secretKey,
  });

  return {
    isAuthorized: async (req: { body: any} & IncomingMessage, _res: ServerResponse) => {
      const requestState = await clerk.authenticateRequest(
          toFetchRequest(req),
          { publishableKey: process.env.TINA_PUBLIC_CLERK_PUBLIC_KEY! }
      );

      if (requestState.status === 'signed-in') {
        const user = await clerk.users.getUser(requestState.toAuth().userId);
        if (orgId) {
          // Get the list of member id's for the organization
          const membershipList = (
            await clerk.organizations.getOrganizationMembershipList({
              organizationId: orgId,
              limit: 100 //come back to this when we have orgs with more than 100 members
            })
          );
          const orgUser = membershipList?.data?.find((mem) => (mem.publicUserData?.userId === user.id));
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
          // if this is an edit to the History collection, pass it through
          if (req.body?.variables?.collection === 'editHistory') {
            return { isAuthorized: true as const };
          }
          // non-admin users cannot delete
          if (req.body?.query?.includes('DeleteDocument')) {
            return {
              isAuthorized: false as const,
              errorMessage: 'You do not have permission to delete documents.',
              errorCode: 401,
            };           
          }
          // non-admin users cannot delete
          if (req.body?.query?.includes('RenameDocument')) {
            return {
              isAuthorized: false as const,
              errorMessage: 'You do not have permission to rename documents.',
              errorCode: 401,
            };           
          }
          // non-admin users can only edit paths and posts
          if (req.body?.variables?.collection && !(req.body?.variables?.collection === 'post' || req.body?.variables?.collection === 'path')) {
            return {
              isAuthorized: false as const,
              errorMessage: 'You do not have access to this collection.',
              errorCode: 401,
            };
          }
          for (const collection of ['path', 'post']) {
            if (
              req.body?.variables?.params 
            ) {
              // non-admin users can only edit paths and posts they created
              if (req.body?.variables?.params[collection]?.creator?.id 
                && req.body?.variables?.params[collection]?.creator?.id !== user.id
              ) {
                return {
                  isAuthorized: false as const,
                  errorMessage: 'You may only edit content you created.',
                  errorCode: 401,
                };
              }

              // non-admin users cannot publish posts or edit published posts
              if (req.body?.variables?.params[collection]?.published) {
                return {
                  isAuthorized: false as const,
                  errorMessage: 'You may not edit published content.',
                  errorCode: 401,
                }
              }
            }
          }
          // non-admin users cannot publish posts or edit published posts
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

// Clerk SSO is required for deployed CDP sites as of v1.9.0 — see docs/upgrade-notes.md.
const authProvider = isLocal
  ? LocalBackendAuthProvider()
  : ClerkBackendAuthentication({
    secretKey: process.env.CLERK_SECRET!,
    orgId: process.env.TINA_PUBLIC_CLERK_ORG_ID
  })

const tinaBackend = TinaNodeBackend({
  authProvider,
  databaseClient
});

const mediaHandler = createMediaHandler({
  config: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },

    region: process.env.S3_REGION,
  },
  bucket: process.env.S3_BUCKET!,
  mediaRoot: process.env.S3_FOLDER,
  authorized: async (req, _res) => {
    const { isAuthorized } = await authProvider.isAuthorized(req, _res);
    return isAuthorized;
  }
});

async function createEditHistoryEntry({
  docId,
  collection,
  crudType,
  userEmail,
  userName,
  userID,
  timestamp,
  note,
  authCookie
}: {
  docId: string;
  collection: string;
  crudType: string;
  userEmail?: string;
  userName?: string;
  userID: string;
  timestamp: string;
  note?: string;
  authCookie: string;
}) {
  const ADD_EDIT_HISTORY_MUTATION = `
    mutation CreateEditHistory(
      $relativePath: String!
      $docId: String!
      $collection: String!
      $crudType: String!
      $timestamp: String!
      $note: String
      $userEmail: String
      $userName: String
      $userID: String!
    ) {
      createEditHistory(
        relativePath: $relativePath
        params: {
          docId: $docId
          collection: $collection
          crudType: $crudType
          timestamp: $timestamp
          note: $note
          userEmail: $userEmail
          userName: $userName
          userID: $userID
        }
      ) {
        __typename
        ... on EditHistory {
          _sys {
            filename
          }
          docId
          collection
          crudType
          timestamp
          note
          userEmail
          userName
          userID
        }
      }
    }
  `;
  // Choose a relativePath for the history doc
  const safeDocId = docId.replace(/[^\w.-]/g, "_");
  const safeCollection = collection.replace(/[^\w.-]/g, "_");
  const fileName = `${timestamp}-${safeCollection}-${safeDocId}.json`.replace(
    /[:]/g,
    "-"
  );

  const endpoint =
    process.env.TINA_GRAPHQL_ENDPOINT ??
    `${process.env.URL ?? "http://localhost:8888"}/api/tina/gql`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: authCookie
    },
    body: JSON.stringify({
      query: ADD_EDIT_HISTORY_MUTATION,
      variables: {
        relativePath: fileName,
        docId,
        collection,
        crudType,
        timestamp,
        note,
        userEmail,
        userName,
        userID
      },
    }),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    console.error("Tina GraphQL error", json.errors);
    throw new Error("Failed to create edit history document");
  }

  return json.data;
}

app.post('/api/tina/edit-history', async (req, res) => {
  try {
    const {
      docId,
      collection,
      crudType,
      userEmail,
      userName,
      userID,
      timestamp,
      note
    } = req.body;

    if (!docId || !collection || !timestamp) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await createEditHistoryEntry({
      docId,
      collection,
      crudType,
      userEmail,
      userName,
      userID,
      timestamp,
      note,
      authCookie: req.headers.cookie || ''
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Error creating edit history entry", e);
    return res.status(500).json({ message: "Failed to create edit history" });
  }
});

app.post('/api/tina/*splat', async (req, res) => {
  if (req.body?.query?.includes('DeleteDocument') || req.body?.query?.includes('RenameDocument')) {
    const { isAuthorized } = await authProvider.isAuthorized(req, res);
    if (isAuthorized) {
      // In this case we need to make a log in the edit history
      // First we have to determine the current user
      const clerk = createClerkClient({
        secretKey: process.env.CLERK_SECRET
      });
  
      const requestState = await clerk.authenticateRequest(
        toFetchRequest(req),
        { publishableKey: process.env.TINA_PUBLIC_CLERK_PUBLIC_KEY! }
      );
  
      if (requestState.status === 'signed-in') {
        const user = await clerk.users.getUser(requestState.toAuth().userId);
        // Now we have the user, and we can call the 
        await createEditHistoryEntry({
          docId: `content/${req.body.variables?.collection}/${req.body.variables?.relativePath}`,
          collection: req.body.variables?.collection,
          crudType: req.body?.query?.includes('DeleteDocument') ? 'delete' : 'rename',
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userName: user?.firstName + ' ' + user?.lastName,
          userID: user?.id,
          timestamp: new Date().toISOString(),
          authCookie: req.headers?.cookie || '',
          note: req.body?.query?.includes('RenameDocument') ? `Renamed to ${req.body?.variables?.newRelativePath}` : undefined
        });
      }
    }
  }
  tinaBackend(req, res);
});

app.get('/api/tina/*splat', async (req, res) => {
  tinaBackend(req, res);
});


app.get('/api/s3/media', mediaHandler);


// This route is necessary currently as a workaround for a bug in next-tinacms-s3 
// where the folder is not prepended to the file name when uploading
app.get('/api/s3/media/*splat', (req, res, next) => {
  if (req.query.key) {
    patchQuery(req, { key: process.env.S3_FOLDER + '/' + req.query.key });
  }
  next();
}, mediaHandler);

app.post('/api/s3/media', mediaHandler);

app.delete('/api/s3/media/:media', (req, res) => {
  patchQuery(req, { media: ['media', req.params.media] });
  return mediaHandler(req, res);
});

export const handler = ServerlessHttp(app);