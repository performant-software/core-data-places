import { defineCollection } from "astro:content";
import config from "@config";
import { coreDataLoader } from "./loaders/coreDataLoader";

const models = config.detail_pages;

let cols = {};

if (import.meta.env.PUBLIC_STATIC_BUILD) {
  console.log(models)
  for (const model of models) {
    cols[model] = defineCollection({
      loader: coreDataLoader({
        model: model,
        getRelations: true,
      }),
    });
  }
}


export const collections = cols;
