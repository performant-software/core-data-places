import type { APIRoute, GetStaticPaths } from "astro";
import { getEntry } from "astro:content";
import { getCollection } from "astro:content";
import config from "@config";
import { loaderDict } from "@root/src/loaders/api";
import { getRelation, relatedModelTypes } from "@root/src/loaders/api/helpers";

export const prerender = true;

export const GET: APIRoute = async ({ params }) => {
  let data: any = {};
  const { model, slug, relatedModel } = params;

  if (import.meta.env.PUBLIC_STATIC_BUILD) {
    // @ts-ignore
    const entry = await getEntry(model, slug);
    // @ts-ignore
    data[relatedModel] = entry?.data.relatedRecords[relatedModel];
  } else {
    data = await getRelation(model, slug, relatedModel);
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getStaticPaths = (async () => {
  if (!import.meta.env.PUBLIC_STATIC_BUILD) {
    return [];
  }
  const models = config.detail_pages;
  let routes = [];
  for (const model of models) {
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
