import { modelTypes } from '@loaders/coreDataLoader';
import { getFullRecord } from '@root/src/services';
import { Models } from '@root/src/utils/types';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ params }) => {
  const { model, uuid } = params;

  const data = await getFullRecord(model as Models, uuid);

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getStaticPaths = (async () => {
  let routes = [];

  for (const model of modelTypes.filter((model) => (model.fetchOne))) {
    // @ts-ignore
    const pages = await getCollection(model.model);
    if (pages && pages.length) {
      const locPages = pages.map((page) => ({
        params: {
          // @ts-ignore
          uuid: page.id,
          model: model.model,
        },
      }));

      routes = [...routes, ...locPages];
    }
  }
  return routes;
}) satisfies GetStaticPaths;
