import config from '@config' with { type: 'json' };
import type { LoaderContext } from 'astro/loaders';
import _ from 'underscore';
import { CONTENT_MODE, STATIC_BUILD } from 'astro:env/client';
import fs from 'fs';

const RELATIONSHIP_ATTRIBUTES = [
  'uuid',
  'project_model_relationship_uuid',
  'project_model_relationship_inverse',
];

//amount to pause between loop iterations, in ms
const DELAY = 500;

/**
 * Helper function to add delay between loop iterations
 *
 * @param ms
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * To avoid duplicating data, only store the necessary attributes for related records. The full record will be fetched
 * from the respective content collection at build time.
 *
 * @param records
 */
const filterRelated = (records) => {
  return _.map(records, (record) => _.pick(record, ...RELATIONSHIP_ATTRIBUTES));
};

export const createLoader = (name, Service, [indexName, showName]) => ({
  name,
  load: async (context: LoaderContext): Promise<void> => {
    const { generateDigest, logger, meta, parseData, store } = context;

    if (CONTENT_MODE === 'refresh') {
      logger.info('Clearing the data store...');
      store.clear();
      logger.info(`Data store ${name} cleared.`);
    }

    const service = new Service(
      config.core_data.url,
      config.core_data.project_ids
    );
    const params = { per_page: 100 };

    const startTime = Date.now();
    logger.info('Loading data');

    const DATA_BASE_PATH = 'data/fairdata';

    const records = [];
    if (fs.existsSync(`${DATA_BASE_PATH}/${indexName}/index.json`)) {
      const recordsRaw = fs.readFileSync(`${DATA_BASE_PATH}/${indexName}/index.json`, 'utf-8');
      const listBaseRecords = JSON.parse(recordsRaw)[indexName];
      for (const { uuid } of listBaseRecords) {
        try {
          const baseRecord = JSON.parse(fs.readFileSync(`${DATA_BASE_PATH}/${indexName}/${uuid}.json`, 'utf-8'))[showName];
          const record = {
            ...baseRecord,
            relatedRecords: {}
          };
          const relatedModels = ['events', 'instances', 'items', 'media_contents', 'organizations', 'people', 'places', 'taxonomies', 'works'];
          for (const model of relatedModels) {
            if (!fs.existsSync(`${DATA_BASE_PATH}/${indexName}/${uuid}/${model}.json`)) {
              record.relatedRecords[model] = [];
              continue;
            }
            try {
              const relatedRecords = JSON.parse(fs.readFileSync(`${DATA_BASE_PATH}/${indexName}/${uuid}/${model}.json`, 'utf-8'))[model];
              record.relatedRecords[model] = filterRelated(relatedRecords)
            } catch {
              logger.info(`Error loading related ${model} for record ${uuid}`)
            }
          }
          if (STATIC_BUILD) {
            // In this case we need to modify the media contents to point at local records
            // This process should be improved!
            record.relatedRecords['media_contents'] = _.map(record.relatedRecords['media_contents'], (media: any) => {
              const { content_type, content_url, project_model_uuid, project_model_relationship_uuid, user_defined, uuid, name } = media;
              const resourceId = content_url?.split('resources/')[1].split('/')[0];
              return ({
                content_type,
                project_model_uuid,
                project_model_relationship_uuid,
                user_defined,
                uuid,
                name,
                content_url: `/iiif/3/image/${resourceId}/full/max/0/default.jpg`,
                content_preview_url: `/iiif/3/image/${resourceId}/full/max/0/default.jpg`, //this should be gleaned from the relevant info.json
                content_iiif_url: `/iiif/3/image/${resourceId}/full/max/0/default.jpg`
              })
            });
          }
      
          records.push(record);;
        } catch (error) {
          logger.info(`Error loading record ${uuid}`);
          continue;
        }
      }
    }


    // let count = 1;
    // let pages = 1;
    // let total = 1;
    // let failed = 0;


    // for (let page = 1; page <= pages; page += 1) {
    //   logger.info(`Fetching page ${page}`);

    //   const listResponse = await service.fetchAll(_.extend(params, { page }));
    //   const listRecords = (listResponse && listResponse[indexName]) || [];

    //   if (listResponse.list?.pages > pages) {
    //     pages = listResponse.list?.pages;
    //   }

    //   if (listResponse.list?.count > total) {
    //     total = listResponse.list?.count;
    //   }

    //   for (const { uuid } of listRecords) {
    //     if (CONTENT_MODE === 'add' && store.get(uuid)) {
    //       logger.info(`Record ${uuid} already exists. Skipping.`);
    //       continue;
    //     }
    //     try {
    //       const recordStart = Date.now();
    //       logger.info(`Loading ${uuid} ${count} of ${total}`);

    //       const [
    //         response,
    //         { events },
    //         { instances },
    //         { items },
    //         { media_contents },
    //         { organizations },
    //         { people },
    //         { places },
    //         { taxonomies },
    //         { works },
    //         manifests,
    //       ] = await Promise.all([
    //         service.fetchOne(uuid),
    //         service.fetchRelatedEvents(uuid, params),
    //         service.fetchRelatedInstances(uuid, params),
    //         service.fetchRelatedItems(uuid, params),
    //         service.fetchRelatedMedia(uuid, params),
    //         service.fetchRelatedOrganizations(uuid, params),
    //         service.fetchRelatedPeople(uuid, params),
    //         service.fetchRelatedPlaces(uuid, params),
    //         service.fetchRelatedTaxonomies(uuid, params),
    //         service.fetchRelatedWorks(uuid, params),
    //         service.fetchRelatedManifests(uuid, params),
    //       ]);

    //       const record = response[showName];

    //       let mediaContents = media_contents;


    //       const recordEnd = Date.now();
    //       logger.info(`${uuid} complete in ${recordEnd - recordStart}ms`);
    //     } catch (error) {
    //       logger.info(`Error loading record ${uuid}: ${error}`);
    //       failed += 1;
    //     } finally {
    //       await delay(DELAY);
    //       count += 1;
    //     }
    //   }
    // }

    // logger.info(`Completed fetching data.${failed ? ` ${failed} record(s) failed to fetch.` : ''}`);

    // Store the items in the Astro content layer
    for (const record of records) {
      const data = await parseData({ id: record.uuid, data: record });
      const digest = generateDigest(data);
      const updated = store.set({ id: record.uuid, data, digest }); //this will return false if the digests match, and the record will not be set
      if (updated) {
        meta.set('lastModified', new Date().toISOString());
      }
    }

    const endTime = Date.now();
    logger.info(
      `Datastore updated with ${records?.length} records in ${endTime - startTime}ms`
    );
  },
});
