import type { Loader, LoaderContext } from "astro/loaders";
import config from "@config";

export async function fetchModelData(options: {
  projectId: number | number[];
  model: { model: string; relations: string[] };
}) {
  const url = new URL(
    `/core_data/public/v1/${options.model.model}?project_ids=${config.core_data.project_ids}`,
    config.core_data.url
  );
  let response = await fetch(url).then((res) => res.json());
  if (response?.list?.pages != 1) {
    response = await fetch(
      new URL(
        `/core_data/public/v1/${options.model.model}?project_ids=${config.core_data.project_ids}&limit=${response?.list?.count}`,
        config.core_data.url
      )
    );
  }
  return response[options.model.model];
}

export function coreDataLoader(options: {
  projectId: number | number[];
  model: { model: string; relations: string[] };
}): Loader {
  return {
    name: "core-data-loader",
    load: async (context: LoaderContext): Promise<void> => {
      const { generateDigest, logger, parseData, store } = context;
      logger.info("Loading item data");
      const response = await fetchModelData(options);
      logger.info("Updating datastore");
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
    },
  };
}
