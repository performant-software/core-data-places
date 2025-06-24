import { deleteSessionItem, getSessionItem } from '@services/session';
import { buildResponse } from '@utils/api';
import { parseSearchParams } from '@utils/url';
import { APIRoute } from 'astro';

export const DELETE: APIRoute = async ({ params, session }) => {
  const { id, key } = params;

  await deleteSessionItem(session, key, id);

  return buildResponse(null);
};

export const GET: APIRoute = async ({ params, request, session }) => {
  const { id, key } = params;
  const { sessionId } = parseSearchParams(request.url);

  const item = await getSessionItem(session, key, id, sessionId);

  return buildResponse(item);
}