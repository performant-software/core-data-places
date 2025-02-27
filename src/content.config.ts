import { coreDataLoader, modelTypes } from '@loaders/coreDataLoader';
import { defineCollection } from 'astro:content';
import _ from 'underscore';

const isStaticBuild = !!import.meta.env.STATIC_BUILD;

let cols = {};

if (isStaticBuild) {
  for (const model of modelTypes) {
    cols[model] = defineCollection({
      loader: coreDataLoader({
        model: model,
        getRelations: true
      }),
    });
  }
}

export const collections = cols;

export const hasContentCollection = (name) => isStaticBuild && _.has(cols, name);
