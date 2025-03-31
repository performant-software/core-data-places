import { modelTypes, relatedModelTypes } from '@loaders/coreDataLoader';
import { getRelatedRecords } from '@root/src/services';
import { Models } from '@root/src/utils/types';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ params }) => {
  const { model, uuid, relatedModel } = params;

  const data = await getRelatedRecords(
    model as Models,
    uuid,
    relatedModel as Models
  )

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getStaticPaths = (async () => {
  let routes = [];

  for (const model of modelTypes.filter((model) => (model.getRelations))) {
    // @ts-ignore
    const pages = await getCollection(model.model);
    if (pages && pages.length) {
      for (const type of relatedModelTypes) {
        const locPages = pages.map((page) => ({
          params: {
            // @ts-ignore
            uuid: page.id,
            model: model.model,
            relatedModel: type,
          },
        }));
        routes = [...routes, ...locPages];
      }
    }
  }
  return routes;
}) satisfies GetStaticPaths;
