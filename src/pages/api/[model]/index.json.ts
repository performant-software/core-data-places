import ServiceFactory from '@services/coreData/factory';
import { buildResponse } from '@utils/api';
import type { APIRoute, GetStaticPaths } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  const { model } = params;

  const service = ServiceFactory.getService(model);
  const data = await service.getAll();

  return buildResponse(data);
};

export const getStaticPaths = (async () => {
  const routes = [];

  const models = ServiceFactory.getModels();

  for (const model of models) {
    routes.push({ params: { model } });
  }

  return routes;
}) satisfies GetStaticPaths;
