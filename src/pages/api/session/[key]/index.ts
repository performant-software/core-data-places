import { addToSession, deleteSession, getSession } from '@services/session';
import { buildResponse } from '@utils/api';
import { parseSearchParams } from '@utils/url';
import { APIRoute } from 'astro';

const EXCLUDE_DELIMITER = ',';

export const DELETE: APIRoute = async ({ request, session }) => {
  const sessionId = request.headers.get('x-session-id');
  await session.load(sessionId);

  await deleteSession(session, 'search');
  return buildResponse(null);
};

export const GET: APIRoute = async ({ params, request, session }) => {
  const sessionId = request.headers.get('x-session-id');
  await session.load(sessionId);

  const { key } = params;

  const search = parseSearchParams(request.url);
  const exclude = search?.exclude?.split(EXCLUDE_DELIMITER);

  const data = await getSession(session, key, exclude);

  return buildResponse(data);
};

export const POST: APIRoute = async ({ params, request, session }) => {
  const sessionId = request.headers.get('x-session-id');
  await session.load(sessionId);

  const { key } = params;
  const data = await request.json();

  await addToSession(session, key, data);

  return buildResponse(null);
};

export const getStaticPaths = () => [];