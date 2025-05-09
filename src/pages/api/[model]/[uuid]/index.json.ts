import ServiceFactory from '@services/coreData/factory';
import { buildResponse, buildStaticPaths } from '@utils/api';
import type { APIRoute, GetStaticPaths } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  const { model, uuid } = params;

  const service = ServiceFactory.getService(model);
  const data = await service.getOne(uuid);

  return buildResponse(data);
};

export const getStaticPaths = (async () => await buildStaticPaths()) satisfies GetStaticPaths;
