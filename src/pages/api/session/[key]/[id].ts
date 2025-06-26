import { deleteSessionItem, getSessionItem } from '@services/session';
import { buildResponse } from '@utils/api';
import { APIRoute } from 'astro';

export const DELETE: APIRoute = async ({ params, request, session }) => {
  const sessionId = request.headers.get('x-session-id');
  await session.load(sessionId);

  const { id, key } = params;
  const data = await deleteSessionItem(session, key, id);

  return buildResponse(data);
};

export const GET: APIRoute = async ({ params, request, session }) => {
  const sessionId = request.headers.get('x-session-id');
  await session.load(sessionId);

  const { id, key } = params;
  const item = await getSessionItem(session, key, id);

  return buildResponse(item);
};