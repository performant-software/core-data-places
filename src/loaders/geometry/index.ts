import { truncate } from '@turf/turf';
import type { LoaderContext } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import config from '@config' with { type: 'json' };
import { PlacesService } from '@performant-software/core-data/ssr';
import { STATIC_BUILD } from 'astro:env/client';
import _ from 'underscore';
import fs from 'fs';

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

    const startTime = Date.now();
    logger.info('Loading data...');

    let count = 1;

    const records = [];

    // If we're in STATIC_BUILD mode, we can read the place data directly from the static files in `/api`
    if (STATIC_BUILD) {
      const listRecords = fs.existsSync('api/places/index.json') ? JSON.parse(fs.readFileSync(`api/places/index.json`, 'utf-8')).places : [];
  
      for (const record of listRecords) {
        const { uuid, name } = record;
  
        let data;
  
        if (record.place_geometry?.geometry_json) {
          data = truncate(record.place_geometry?.geometry_json, { precision: 3, coordinates: 2 });
        } else {
          data = {};
        }
  
        const geometry = JSON.stringify(data);
  
        records.push({ uuid, name, recordId: count, geometry });
        count += 1;
      }
    } else {
      const service = new PlacesService(
        config.core_data.url,
        config.core_data.project_ids
      );
  
      const params = { per_page: 20 };
    
      let pages = 1;
      let total = 0;
  
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
          const { uuid, name } = record;
  
          let data;
  
          if (record.place_geometry?.geometry_json) {
            data = truncate(record.place_geometry?.geometry_json, { precision: 3, coordinates: 2 });
          } else {
            data = {};
          }
  
          const geometry = JSON.stringify(data);
  
          records.push({ uuid, name, recordId: count, geometry });
          count += 1;
        }
      }
    }

    // Store the items in the Astro content layer
    for (const record of records) {
      const data = await parseData({ id: record.uuid, data: record });
      const digest = generateDigest(data);
      store.set({ id: record.uuid, data, digest });
    }

    const endTime = Date.now();
    logger.info(`Datastore updated. ${count - 1} record(s) in ${endTime - startTime}ms`);
  }
};

export default {
  geometry: defineCollection({ loader })
};