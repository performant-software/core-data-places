import { buildResponse } from '@utils/api';
import { APIRoute } from 'astro';
import { getPosts } from '@services/posts';
import { convertToNumber } from '@utils/url';
import config from '@config';

export const GET: APIRoute = async (req) => {
  const params = req.url.searchParams.keys().reduce((acc, key) => ({
    ...acc,
    [key]: convertToNumber(req.url.searchParams.get(key))
  }), {});

  let filter = {};

  filter['published'] = { eq: true };

  if (params?.category) {
    filter['category'] = { eq: params.category };
  }

  const data = await getPosts({...params, filter});

  return buildResponse(data);
};
