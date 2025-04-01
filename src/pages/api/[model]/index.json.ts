import { loaderDict } from '@loaders/coreData';
import { modelTypes } from '@loaders/coreData/coreDataLoader';
import { hasContentCollection } from '@root/src/content.config';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ params }) => {
  let data;
  const { model } = params;

  if (hasContentCollection(model)) {
    // @ts-ignore
    const entries = await getCollection(model);
    data = entries?.map((entry: any) => entry.data);
  } else {
    data = await loaderDict[model].fetchAll();
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getStaticPaths = (async () => {
  const routes = [];

  for (const model of modelTypes) {
    routes.push({ params: { model: model.model } });
  }

  return routes;
}) satisfies GetStaticPaths;
