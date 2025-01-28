import type { Loader, LoaderContext } from "astro/loaders";
import config from "@config";
import { AstroIntegrationLogger } from "astro";

export const relatedModelTypes = [
  "events",
  "media_contents",
  "organizations",
  "people",
  "places",
];

export const createProjectIdString = (ids: string[]) => {
  let str = "";
  if (!ids.length) {
    return str;
  }
  for (let i = 0; i < ids.length; i++) {
    if (i > 0) {
      str += "&";
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
    `/core_data/public/v1/${model}/${uuid}/${relatedModel}?${createProjectIdString(config.core_data.project_ids)}`,
    config.core_data.url
  );
  const response = await fetch(url).then((res) => res.json());
  return response[relatedModel];
}

export async function getRelations(
  model: string,
  uuid: string,
  relatedModels: string[],
  logger?: AstroIntegrationLogger
) {
  let relatedRecords: { [key: string]: any } = {};
  logger && logger.info(`fetching related records for ${uuid}`);
  for (let i = 0; i < relatedModels.length; i++) {
    const relatedModel = relatedModels[i];
    const relations = await getRelation(model, uuid, relatedModel);
    relatedRecords[relatedModel] = relations;
  }
  return relatedRecords;
}

export async function fetchItemData(model: string, uuid: string) {
  const url = new URL(
    `/core_data/public/v1/${model}/${uuid}?${createProjectIdString(config.core_data.project_ids)}`,
    config.core_data.url
  );
  const response = await fetch(url).then((res) => res.json());
  return Object.values(response) ? Object.values(response)[0] : null;
}

export async function fetchModelData(
  options: {
    projectId: number | number[];
    model: string;
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) {
  const url = new URL(
    `/core_data/public/v1/${options.model}?${createProjectIdString(config.core_data.project_ids)}`,
    config.core_data.url
  );
  let response = await fetch(url).then((res) => res.json());
  if (response?.list?.pages != 1) {
    response = await fetch(
      new URL(
        `/core_data/public/v1/${options.model}?${createProjectIdString(config.core_data.project_ids)}&per_page=${response?.list?.count}`,
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

export function coreDataLoader(options: {
  projectId: number | number[];
  model: string;
  getRelations?: boolean;
}): Loader {
  return {
    name: "core-data-loader",
    load: async (context: LoaderContext): Promise<void> => {
      const { generateDigest, logger, parseData, store } = context;
      const startTime = Date.now();
      logger.info("Loading item data");
      const response = await fetchModelData(options, logger);
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
