import { buildResponse } from '@utils/api';
import { APIRoute } from 'astro';
import { getPaths } from '@services/paths';
import { convertToNumber } from '@utils/url';

export const GET: APIRoute = async (req) => {
  const params = req.url.searchParams.keys().reduce((acc, key) => ({
    ...acc,
    [key]: convertToNumber(req.url.searchParams.get(key))
  }), {});

  //enforcing published filter for all sites (is this what we want?)
  let filter = {
    published: { eq: true }
  };

  if (params?.category) {
    filter['category'] = { eq: params.category };
  }

  const data = await getPaths({...params, filter});

  return buildResponse(data);
};