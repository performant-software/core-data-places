import { coreDataLoader, modelTypes } from '@loaders/coreData/coreDataLoader';
import { loader } from '@loaders/i18n';
import { defineCollection } from 'astro:content';
import _ from 'underscore';

const isStaticBuild = !!import.meta.env.STATIC_BUILD;

let cols = {};

if (isStaticBuild) {
  for (const model of modelTypes) {
    cols[model.model] = defineCollection({
      loader: coreDataLoader({
        model: model.model,
        getRelations: model.getRelations
      }),
    });
  }

  cols['i18n'] = defineCollection({
    loader: loader()
  });
}

export const collections = cols;

export const hasContentCollection = (name) => isStaticBuild && _.has(cols, name);
