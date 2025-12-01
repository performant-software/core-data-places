import { buildResponse } from '@utils/api';
import { APIRoute } from 'astro';
import { getOne } from '@services/gallery';
import { getStaticManifestEndpointPaths } from '@utils/galleries';

export const GET: APIRoute = async ({ params }) => {
  const { manifestId } = params;

  const { data } = await getOne(decodeURIComponent(manifestId));

  return buildResponse(data);
};

export const getStaticPaths = async () => await getStaticManifestEndpointPaths();
