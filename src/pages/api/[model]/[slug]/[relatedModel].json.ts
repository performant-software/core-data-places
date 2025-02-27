import { getRelation } from '@loaders/api/helpers';
import { modelTypes, relatedModelTypes } from '@loaders/coreDataLoader';
import { hasContentCollection } from '@root/src/content.config';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, getEntry } from 'astro:content';

export const GET: APIRoute = async ({ params }) => {
  let data: any = {};
  const { model, slug, relatedModel } = params;

  if (hasContentCollection(model)) {
    // @ts-ignore
    const entry = await getEntry(model, slug);
    data[relatedModel] = entry?.data.relatedRecords[relatedModel];
  } else {
    data = await getRelation(model, slug, relatedModel);
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getStaticPaths = (async () => {
  let routes = [];

  for (const model of modelTypes) {
    // @ts-ignore
    const pages = await getCollection(model);
    if (pages && pages.length) {
      for (const type of relatedModelTypes) {
        const locPages = pages.map((page) => ({
          params: {
            // @ts-ignore
            slug: page.id,
            model: model,
            relatedModel: type,
          },
        }));
        routes = [...routes, ...locPages];
      }
    }
  }
  return routes;
}) satisfies GetStaticPaths;
