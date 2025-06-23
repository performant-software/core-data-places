import coreDataLoader from '@loaders/coreData';
import i18nLoader from '@loaders/i18n';
import { isStaticBuild, useContentCache } from '@utils/app';
import _ from 'underscore';

const collections = {};

if (isStaticBuild && !useContentCache) {
  _.extend(collections, { ...coreDataLoader, ...i18nLoader });
}

export {
  collections
};

export const hasContentCollection = (name) => isStaticBuild && _.has(collections, name);
