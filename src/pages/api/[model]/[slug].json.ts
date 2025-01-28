import type { APIRoute, GetStaticPaths } from "astro";
import { getEntry } from "astro:content";
import { getCollection } from "astro:content";
import config from "@config";
import { getRelations, fetchItemData } from "@root/src/loaders/coreDataLoader";
import { relatedModelTypes } from "@root/src/loaders/coreDataLoader";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  let data: any;
  const { model, slug } = params;

  if (config.static_build) {
    // @ts-ignore
    data = await getEntry(model, slug);
  } else {
    const response = await fetchItemData(model, slug);
    const relations = await getRelations(model, slug, relatedModelTypes);
    // @ts-ignore
    data = { data: { ...response, relatedRecords: relations } };
  }

  return new Response(JSON.stringify(data.data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getStaticPaths = (async () => {
  if (!config.static_build) {
    return [];
  }
  const models = config.detail_pages;
  let routes = [];
  for (const model of models) {
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
