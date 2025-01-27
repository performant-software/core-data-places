import { defineCollection } from "astro:content";
import config from "@config";
import { coreDataLoader } from "./loaders/coreDataLoader";

const models = config.static_pages;

let cols = {};

for (const model of models) {
  cols[model] = defineCollection({
    loader: coreDataLoader({
      projectId: config.core_data.project_ids,
      model: model,
      getRelations: true,
    }),
  });
}

export const collections = cols;
