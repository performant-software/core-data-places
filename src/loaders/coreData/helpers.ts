import config from '@config';
import { LoaderContext } from 'astro/dist/content/loaders';

export const createLoader = (name, Service, [indexName, showName]) => ({
  name,
  load: async (context: LoaderContext): Promise<void> => {
    const { generateDigest, logger, parseData, store } = context;

    const service = new Service(config.core_data.url, config.core_data.project_ids);
    const params = { per_page: 0 };

    const startTime = Date.now();
    logger.info('Loading item data');

    const listResponse = await service.fetchAll(params);
    const records = (listResponse && listResponse[indexName]) || [];

    for (const { uuid } of records) {
      const response = await service.fetchOne(uuid);
      const record = response[showName];

      const { events } = await service.fetchRelatedEvents(uuid, params);
      const { instances } = await service.fetchRelatedInstances(uuid, params);
      const { items } = await service.fetchRelatedItems(uuid, params);
      const { organizations } = await service.fetchRelatedOrganizations(uuid, params);
      const { people } = await service.fetchRelatedPeople(uuid, params);
      const { places } = await service.fetchRelatedPlaces(uuid, params);
      const { taxonomies } = await service.fetchRelatedTaxonomies(uuid, params);
      const { works } = await service.fetchRelatedWorks(uuid, params);

      const manifests = await service.fetchRelatedManifests(uuid, params);

      const item = {
        ...record,
        relatedRecords: {
          events,
          instances,
          items,
          manifests,
          organizations,
          people,
          places,
          taxonomies,
          works
        }
      };

      // Store the item in the Astro content layer
      const data = await parseData({ id: item.uuid, data: item });
      const digest = generateDigest(data);
      store.set({ id: item.uuid, data, digest });
    }

    const endTime = Date.now();
    logger.info(`Datastore updated in ${endTime - startTime}ms`);
  }
});
