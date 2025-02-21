import { buildStaticEndpoints, coreDataLoader, modelTypes } from '@loaders/coreDataLoader';
import { defineCollection } from 'astro:content';

let cols = {};

if (buildStaticEndpoints) {
  for (const model of modelTypes) {
    cols[model] = defineCollection({
      loader: coreDataLoader({
        model: model,
        getRelations: true,
      }),
    });
  }
}

export const collections = cols;
