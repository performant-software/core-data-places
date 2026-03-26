import type { Context } from "@netlify/edge-functions";
import { Clerk, type User } from "@clerk/backend";

const NETLIFY_API = "https://api.netlify.com/api/v1";
const SITE_ID = process.env.NETLIFY_SITE_ID!;
const NETLIFY_TOKEN = process.env.NETLIFY_ACCESS_TOKEN!;
const secretKey = process.env.CLERK_SECRET;

interface NetlifyDeploy {
  id: string;
  state: string;
  created_at: string;
  [key: string]: unknown;
}

interface NetlifyBuild {
  id: string;
  [key: string]: unknown;
}

interface ApiResponse {
  error?: string;
  detail?: string;
  message?: string;
  build_id?: string;
  build?: {
    id: string;
    state: string;
    created_at: string;
  };
}

const clerkClient = Clerk({
  secretKey: process.env.CLERK_SECRET,
});

function buildResponse(statusCode: number, body: ApiResponse | null): Response {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}

async function authenticate(req: Request): Promise<boolean> {
  const token = req.headers.get('authorization');
  const tokenWithoutBearer = token?.replace('Bearer ', '').trim();

  const { toAuth } = await clerkClient.authenticateRequest({
    headerToken: tokenWithoutBearer
  });

  const { sessionClaims, user } = toAuth();

  const isMember = sessionClaims.o.id === process.env.TINA_PUBLIC_CLERK_ORG_ID
  const isAdmin = sessionClaims.o.rol === 'admin'

  return isMember && isAdmin;
}

async function netlifyFetch(path: string, options: RequestInit = {}): Promise<globalThis.Response> {
  return fetch(`${NETLIFY_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${NETLIFY_TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    },
  });
}

async function getActiveBuild(): Promise<NetlifyDeploy | null> {
  const res = await netlifyFetch(`/sites/${SITE_ID}/deploys?per_page=5`);
  const deploys: NetlifyDeploy[] = await res.json();

  const activeStates = [
    "building",
    "enqueued",
    "preparing",
    "processing",
    "uploading",
    "uploaded",
  ];

  return deploys.find((d) => activeStates.includes(d.state)) ?? null;
}

async function triggerBuild(): Promise<NetlifyBuild> {
  const res = await netlifyFetch(`/sites/${SITE_ID}/builds`, {
    method: "POST",
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Netlify API error (${res.status}): ${text}`);
  }

  return res.json();
}

const handler = async (req: Request, _context: Context): Promise<Response> => {
  if (req.method !== "POST") {
    return buildResponse(405, { error: "Method not allowed" });
  }

  let isAdmin = false;
  try {
    isAdmin = await authenticate(req);
  } catch (e) {
    return buildResponse(401, { error: e.message ||  "Authentication failed" });
  }

  if (!isAdmin) {
    return buildResponse(401, { error: "Unauthorized" });
  }

  let activeBuild: NetlifyDeploy | null;
  try {
    activeBuild = await getActiveBuild();
  } catch (err) {
    return buildResponse(502, {
      error: "Failed to check build status",
      detail: (err as Error).message,
    });
  }

  if (activeBuild) {
    return buildResponse(409, {
      error: "A build is already in progress",
      build: {
        id: activeBuild.id,
        state: activeBuild.state,
        created_at: activeBuild.created_at,
      },
    });
  }

  try {
    const build = await triggerBuild();
    return buildResponse(200, {
      message: "Build triggered successfully",
      build_id: build.id,
    });
  } catch (err) {
    return buildResponse(502, {
      error: "Failed to trigger build",
      detail: (err as Error).message,
    });
  }
};

export default handler;

export const config = {
  path: "/api/rebuild",
  method: "POST",
};
