import config from "@config";
import { loaderDict } from "@loaders/api";
import { buildStaticEndpoints, modelTypes } from '@loaders/coreDataLoader';
import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, getEntry } from "astro:content";

export const prerender = !buildStaticEndpoints;

export const GET: APIRoute = async ({ params }) => {
  let data: any;
  const { model, slug } = params;

  if (buildStaticEndpoints) {
    // @ts-ignore
    const entry = await getEntry(model, slug);
    data = entry?.data;
  } else {
    data = await loaderDict[model].fetchOne(slug, false);
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getStaticPaths = (async () => {
  if (!buildStaticEndpoints) {
    return [];
  }

  let routes = [];

  for (const model of modelTypes) {
    // @ts-ignore
    const pages = await getCollection(model);
    if (pages && pages.length) {
      for (const lang of config.i18n.locales) {
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
  }
  return routes;
}) satisfies GetStaticPaths;
