import { buildResponse } from '@utils/api';
import { APIRoute } from 'astro';
import { getPosts } from '@services/posts';
import { convertToNumber } from '@utils/url';

export const GET: APIRoute = async (req) => {
  const params = req.url.searchParams.keys().reduce((acc, key) => ({
    ...acc,
    [key]: convertToNumber(req.url.searchParams.get(key))
  }), {});

  const data = await getPosts(params);

  return buildResponse(data);
};
