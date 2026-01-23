import config from '@config' with { type: 'json' };
import { PlacesService } from '@performant-software/core-data/ssr';
import type { LoaderContext } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import _ from 'underscore';

const loader = {
  name: 'geometry-loader',
  load: async (context: LoaderContext): Promise<void> => {
    const {
      generateDigest,
      logger,
      parseData,
      store
    } = context;

    logger.info('Clearing the data store...');
    store.clear();

    const service = new PlacesService(
      config.core_data.url,
      config.core_data.project_ids
    );

    const params = { per_page: 20 };

    const startTime = Date.now();
    logger.info('Loading data...');

    let count = 0;
    let pages = 1;
    let total = 0;

    const records = [];

    for (let page = 1; page <= pages; page += 1) {
      logger.info(`Fetching page ${page}...`);

      const listResponse = await service.fetchAll(_.extend(params, { page }));
      const listRecords = (listResponse && listResponse.places) || [];

      if (listResponse.list?.pages > pages) {
        pages = listResponse.list?.pages;
      }

      if (listResponse.list?.count > total) {
        total = listResponse.list?.count;
      }

      for (const record of listRecords) {
        const { uuid } = record;
        const geometry = record.place_geometry?.geometry_json && JSON.stringify(record.place_geometry.geometry_json);

        records.push({ uuid, geometry });
        count += 1;
      }
    }

    // Store the items in the Astro content layer
    for (const record of records) {
      const data = await parseData({ id: record.uuid, data: record });
      const digest = generateDigest(data);
      store.set({ id: record.uuid, data, digest });
    }

    const endTime = Date.now();
    logger.info(`Datastore updated. ${count} record(s) in ${endTime - startTime}ms`);
  }
};

export default {
  geometry: defineCollection({ loader })
};