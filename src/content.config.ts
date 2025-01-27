import { defineCollection } from "astro:content";
import config from "@config";
import { coreDataLoader } from "./loaders/coreDataLoader";

const models = config.detail_pages;

let cols = {};

if (config.static_build) {
  for (const model of models) {
    cols[model] = defineCollection({
      loader: coreDataLoader({
        projectId: config.core_data.project_ids,
        model: model,
        getRelations: true,
      }),
    });
  }
}


export const collections = cols;
