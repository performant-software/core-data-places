import coreDataLoader from '@loaders/coreData';
import i18nLoader from '@loaders/i18n';
import _ from 'underscore';

const isStaticBuild = import.meta.env.STATIC_BUILD === 'true';
const useContentCache = import.meta.env.USE_CONTENT_CACHE === 'true';

const collections = {};

if (isStaticBuild && !useContentCache) {
  _.extend(collections, { ...coreDataLoader, ...i18nLoader });
}

export {
  collections
};

export const hasContentCollection = (name) => isStaticBuild && _.has(collections, name);
