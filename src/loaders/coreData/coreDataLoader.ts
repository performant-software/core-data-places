import { loaderDict } from '@loaders/coreData/index';
import type { Loader, LoaderContext } from 'astro/loaders';

export const modelTypes = [
  {
    model: 'events',
    getRelations: true,
    fetchOne: true
  },
  {
    model: 'instances',
    getRelations: true,
    fetchOne: true
  },
  {
    model: 'items',
    getRelations: true,
    fetchOne: true
  },
  {
    model: 'organizations',
    getRelations: true,
    fetchOne: true
  },
  {
    model: 'people',
    getRelations: true,
    fetchOne: true
  },
  {
    model: 'places',
    getRelations: true,
    fetchOne: true
  },
  {
    model: 'works',
    getRelations: true,
    fetchOne: true
  }
]

export const relatedModelTypes = [
  'events',
  'instances',
  'items',
  'manifests',
  'organizations',
  'people',
  'places',
  'taxonomies',
  'works'
];

export function coreDataLoader(options: {
  model: string;
  getRelations?: boolean;
}): Loader {
  return {
    name: 'core-data-loader',
    load: async (context: LoaderContext): Promise<void> => {
      const { generateDigest, logger, parseData, store } = context;
      const startTime = Date.now();
      logger.info('Loading item data');
      const response = await loaderDict[options.model].fetchAll({ getRelations: options.getRelations }, logger);
      const fetchedTime = Date.now();
      logger.info(`Data fetched in ${fetchedTime - startTime}ms`);
      logger.info(`Updating datastore for ${options.model}`);
      for (const item of response) {
        const data = await parseData({
          id: item.uuid,
          data: item,
        });
        const digest = generateDigest(data);
        store.set({
          id: item.uuid,
          data,
          digest,
        });
      }
      const endTime = Date.now();
      logger.info(`Datastore updated in ${endTime - fetchedTime}ms`);
    },
  };
}
