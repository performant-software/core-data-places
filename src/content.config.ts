import coreDataLoader from '@loaders/coreData';
import galleryLoader from '@loaders/gallery';
import geometryLoader from '@loaders/geometry';
import i18nLoader from '@loaders/i18n';
import { PUBLIC_PRELOAD_MAP, STATIC_BUILD, USE_CONTENT_CACHE } from "astro:env/client";
import _ from 'underscore';

const collections = {};

if (STATIC_BUILD && !USE_CONTENT_CACHE) {
  _.extend(collections, { ...coreDataLoader, ...i18nLoader, ...galleryLoader });
}

if (PUBLIC_PRELOAD_MAP && !USE_CONTENT_CACHE) {
  _.extend(collections, geometryLoader);
}

export {
  collections
};

export const hasContentCollection = (name: string) => _.has(collections, name);
