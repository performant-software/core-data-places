import config from '@config';
import { relatedModelTypes } from '@loaders/coreDataLoader';
import { AstroIntegrationLogger } from 'astro';

const path = '/core_data/public/v1/';

export const singularForms = {
  events: 'event',
  instances: 'instance',
  items: 'item',
  manifests: 'manifest',
  media_contents: 'media_content',
  organizations: 'organization',
  people: 'person',
  places: 'place',
  taxonomies: 'taxonomy',
  works: 'work'
};

export const createProjectIdString = (ids: string[] | number[]) => {
  let str = '';
  if (!ids.length) {
    return str;
  }
  for (let i = 0; i < ids.length; i++) {
    if (i > 0) {
      str += '&';
    }
    str += `project_ids[]=${ids[i]}`;
  }
  return str;
};

export async function getRelation(
  model: string,
  uuid: string,
  relatedModel: string
) {
  const url = new URL(
    `${path}${model}/${uuid}/${relatedModel}?${createProjectIdString(config.core_data.project_ids)}`,
    config.core_data.url
  );
  const response = await fetch(url).then((res) => res.json());
  return response;
}

export async function getRelations(
  model: string,
  uuid: string,
  relatedModels: string[] = relatedModelTypes,
  logger?: AstroIntegrationLogger
) {
  let relatedRecords: { [key: string]: any } = {};
  logger && logger.info(`fetching related records for ${uuid}`);
  for (let i = 0; i < relatedModels.length; i++) {
    const relatedModel = relatedModels[i];
    const relations = await getRelation(model, uuid, relatedModel);
    relatedRecords[relatedModel] = relations[relatedModel]
  }
  return relatedRecords;
}

export async function fetchItemData(model: string, uuid: string) {
  const url = new URL(
    `${path}${model}/${uuid}?${createProjectIdString(config.core_data.project_ids)}`,
    config.core_data.url
  );
  const response = await fetch(url).then((res) => res.json());
  return response;
}

export async function fetchModelData(
  options: {
    model: string;
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) {
  const url = new URL(
    `${path}${options.model}?${createProjectIdString(config.core_data.project_ids)}`,
    config.core_data.url
  );
  let response = await fetch(url).then((res) => res.json());
  if (response?.list?.pages != 1) {
    response = await fetch(
      new URL(
        `${path}${options.model}?${createProjectIdString(config.core_data.project_ids)}&per_page=${response?.list?.count}`,
        config.core_data.url
      )
    ).then((res) => res.json());
  }
  if (!options.getRelations) {
    return response[options.model];
  }
  let fullResponse: any[] = [];
  for (let j = 0; j < response[options.model].length; j++) {
    const item = response[options.model][j];
    const relatedRecords = await getRelations(
      options.model,
      item.uuid,
      relatedModelTypes,
      logger
    );
    fullResponse.push({ ...item, relatedRecords: relatedRecords });
  }
  return fullResponse;
}
