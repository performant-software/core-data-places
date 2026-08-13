import { buildResponse } from '@utils/api';
import { APIRoute } from 'astro';
import { getOne } from '@services/gallery';
import { fetchJson, truncateManifestId } from '@utils/galleries';
import config from '@config' with { type: 'json' };

export const GET: APIRoute = async ({ params }) => {
  const { manifestId } = params;

  const { data } = await getOne(decodeURIComponent(manifestId));

  return buildResponse(data);
};

export const getStaticPaths = async () => {
  const result = [];

  if (config.gallery) {
    const topLevel = await fetchJson(config.gallery);

    result.push(...topLevel.items.map(({ id }) => ({
      params: { manifestId: encodeURIComponent(truncateManifestId((id))) }
    })));
  }

  return result;
};
