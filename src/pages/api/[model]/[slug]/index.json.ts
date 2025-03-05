import config from '@config';
import { loaderDict } from '@loaders/api';
import { singularForms } from '@loaders/api/helpers';
import { modelTypes } from '@loaders/coreDataLoader';
import { hasContentCollection } from '@root/src/content.config';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, getEntry } from 'astro:content';

export const GET: APIRoute = async ({ params }) => {
  let data: any = {};
  const { model, slug } = params;
  const singular = singularForms[model];

  if (hasContentCollection(model)) {
    // @ts-ignore
    const entry = await getEntry(model, slug);
    let detail: any = {};

    Object.keys(entry.data)
      ?.filter((key) => key !== 'relatedRecords')
      .forEach((key) => {
        detail[key] = entry?.data[key];
      });

    data[singular] = detail;
  } else {
    data = await loaderDict[model].fetchOne(slug, false);
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
      const locPages = pages.map((page) => ({
        params: {
          // @ts-ignore
          slug: page.id,
          model: model,
        },
      }));

      routes = [...routes, ...locPages];
    }
  }
  return routes;
}) satisfies GetStaticPaths;
