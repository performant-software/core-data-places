import { buildResponse } from '@utils/api';
import { APIRoute } from 'astro';
import { getCount } from '@services/geometry';

export const GET: APIRoute = async () => {
  const data = await getCount();
  return buildResponse(data);
};
