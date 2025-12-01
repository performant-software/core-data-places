import coreDataLoader from '@loaders/coreData';
import i18nLoader from '@loaders/i18n';
import galleryLoader from '@loaders/gallery';
import { STATIC_BUILD, USE_CONTENT_CACHE } from "astro:env/client";
import _ from 'underscore';

const collections = {};

if (STATIC_BUILD && !USE_CONTENT_CACHE) {
  _.extend(collections, { ...coreDataLoader, ...i18nLoader, ...galleryLoader });
}

export {
  collections
};

export const hasContentCollection = (name: string) => STATIC_BUILD && _.has(collections, name);
