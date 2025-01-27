import type { Loader, LoaderContext } from "astro/loaders";
import config from "@config";

export const relatedModelTypes = [
  "events",
  "media_contents",
  "organizations",
  "people",
  "places",
];

export async function getRelation(
  model: string,
  uuid: string,
  relatedModel: string
) {
  const url = new URL(
    `/core_data/public/v1/${model}/${uuid}/${relatedModel}?project_ids=${config.core_data.project_ids}`,
    config.core_data.url
  );
  const response = await fetch(url).then((res) => res.json());
  return response[relatedModel];
}

export async function getRelations(
  model: string,
  uuid: string,
  relatedModels: string[]
) {
  let relatedRecords: { [key: string]: any } = {};
  for (let i = 0; i < relatedModels.length; i++) {
    const relatedModel = relatedModels[i];
    const relations = await getRelation(model, uuid, relatedModel);
    relatedRecords[relatedModel] = relations;
  }
  return relatedRecords;
}

export async function fetchItemData(model: string, uuid: string) {
  const url = new URL(
    `/core_data/public/v1/${model}/${uuid}?project_ids=${config.core_data.project_ids}`,
    config.core_data.url
  );
  const response = await fetch(url).then((res) => res.json());
  return Object.values(response) ? Object.values(response)[0] : null;
}

export async function fetchModelData(options: {
  projectId: number | number[];
  model: string;
  getRelations?: boolean;
}) {
  const url = new URL(
    `/core_data/public/v1/${options.model}?project_ids=${config.core_data.project_ids}`,
    config.core_data.url
  );
  let response = await fetch(url).then((res) => res.json());
  if (response?.list?.pages != 1) {
    response = await fetch(
      new URL(
        `/core_data/public/v1/${options.model}?project_ids=${config.core_data.project_ids}&per_page=${response?.list?.count}`,
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
      relatedModelTypes
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
      const response = await fetchModelData(options);
      const fetchedTime = Date.now();
      logger.info(`Data fetched in ${fetchedTime - startTime}ms`);
      logger.info(`Updating datastore for ${options.model}`);
      for (const item of response) {
        logger.info(`Updating item ${item.name}`);
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
