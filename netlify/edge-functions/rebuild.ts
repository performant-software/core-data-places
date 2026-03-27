import type { Context } from '@netlify/edge-functions';
import { Clerk } from '@clerk/backend';

const BASE_URL = 'https://api.netlify.com/api/v1';
const NETLIFY_TOKEN = Netlify.env.get('NETLIFY_TOKEN')!;

const clerkClient = Clerk({
  secretKey: Netlify.env.get('CLERK_SECRET')!,
});

function buildResponse(statusCode: number, body: any | null): Response {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function authenticate(req: Request): Promise<boolean> {
  const token = req.headers.get('authorization');
  const tokenWithoutBearer = token?.replace('Bearer ', '').trim();

  const { toAuth } = await clerkClient.authenticateRequest({
    headerToken: tokenWithoutBearer
  });

  const { sessionClaims } = toAuth();

  const isMember = sessionClaims.o.id === Netlify.env.get('TINA_PUBLIC_CLERK_ORG_ID')
  const isAdmin = sessionClaims.o.rol === 'admin'

  return isMember && isAdmin;
}

async function netlifyFetch(path: string, options: RequestInit = {}): Promise<globalThis.Response> {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${NETLIFY_TOKEN}`,
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    },
  });
}

async function getActiveBuild(siteId: string) {
  const res = await netlifyFetch(`/sites/${siteId}/deploys?per_page=5`);
  const deploys = await res.json();

  const activeStates = [
    'building',
    'enqueued',
    'preparing',
    'processing',
    'uploading',
    'uploaded',
  ];

  return deploys.find((d) => activeStates.includes(d.state)) ?? null;
}

async function triggerBuild(siteId: string) {
  const res = await netlifyFetch(`/sites/${siteId}/builds`, {
    method: 'POST',
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Netlify API error (${res.status}): ${text}`);
  }

  return res.json();
}

const handler = async (req: Request, context: Context): Promise<Response> => {
  if (req.method !== 'POST') {
    return buildResponse(405, { error: 'Method not allowed' });
  }

  let isAdmin = false;
  try {
    isAdmin = await authenticate(req);
  } catch (e) {
    return buildResponse(401, { message: e.message ||  'Authentication failed' });
  }

  if (!isAdmin) {
    return buildResponse(401, { message: 'Unauthorized' });
  }

  let activeBuild;
  try {
    activeBuild = await getActiveBuild(context.site.id);
  } catch (err) {
    return buildResponse(502, {
      message: 'Failed to check build status'
    });
  }

  if (activeBuild) {
    return buildResponse(409, {
      message: 'A build is already in progress'
    });
  }

  try {
    await triggerBuild(context.site.id);
    return buildResponse(200, {
      message: 'Build triggered successfully'
    });
  } catch (err) {
    return buildResponse(502, {
      message: 'Failed to trigger build'
    });
  }
};

export default handler;

export const config = {
  path: '/api/rebuild',
  method: 'POST',
};
