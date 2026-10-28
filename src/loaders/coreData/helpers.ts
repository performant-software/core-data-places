import type { LoaderContext } from 'astro/loaders';
import _ from 'underscore';
import { CONTENT_MODE } from 'astro:env/client';
import fs from 'fs';

const RELATIONSHIP_ATTRIBUTES = [
  'uuid',
  'project_model_relationship_uuid',
  'project_model_relationship_inverse',
];

/**
 * To avoid duplicating data, only store the necessary attributes for related records. The full record will be fetched
 * from the respective content collection at build time.
 *
 * @param records
 */
const filterRelated = (records) => {
  return _.map(records, (record) => _.pick(record, ...RELATIONSHIP_ATTRIBUTES));
};

export const createLoader = (name, [indexName, showName]) => ({
  name,
  load: async (context: LoaderContext): Promise<void> => {
    const { generateDigest, logger, meta, parseData, store } = context;

    if (CONTENT_MODE === 'refresh') {
      logger.info('Clearing the data store...');
      store.clear();
      logger.info(`Data store ${name} cleared.`);
    }

    const startTime = Date.now();
    logger.info('Loading data');

    const DATA_BASE_PATH = 'api';

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
          // media_content and taxonomies don't have their own collection, 
          // so we must store the full info on the base record rather than filtering
          const skipFilter = ['media_contents', 'taxonomies'];
          for (const model of relatedModels) {
            // convert any compound model names to camel case for the relatedRecords attribute
            const camelCase = model.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
            if (!fs.existsSync(`${DATA_BASE_PATH}/${indexName}/${uuid}/${model}.json`)) {
              record.relatedRecords[camelCase] = [];
              continue;
            }
            try {
              const relatedRecords = JSON.parse(fs.readFileSync(`${DATA_BASE_PATH}/${indexName}/${uuid}/${model}.json`, 'utf-8'))[model];
              record.relatedRecords[camelCase] = skipFilter.includes(model) ? relatedRecords : filterRelated(relatedRecords);
            } catch {
              logger.info(`Error loading related ${model} for record ${uuid}`)
            }
          }

          // Fetch the related manifest data
          try {
            const relatedManifests = JSON.parse(fs.readFileSync(`${DATA_BASE_PATH}/${indexName}/${uuid}/manifests.json`, 'utf-8'));
            record.relatedRecords['manifests'] = relatedManifests;
          } catch {
            logger.info(`Error loading related manifests for record ${uuid}`);
          }

          // We need to modify the media contents to point at local records
          // This process is kind of janky and should be improved!
          record.relatedRecords.mediaContents = _.map(record.relatedRecords.mediaContents, (media: any) => {
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
              content_preview_url: `/iiif/3/image/${resourceId}/full/max/0/default.jpg`, //this would ideally be gleaned from the relevant info.json
              content_iiif_url: `/iiif/3/image/${resourceId}/full/max/0/default.jpg`
            })
          });
      
          records.push(record);;
        } catch (error) {
          logger.info(`Error loading record ${uuid}`);
          continue;
        }
      }
    }

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
