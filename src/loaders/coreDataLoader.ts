import type { Loader, LoaderContext } from "astro/loaders";
import {
  eventsLoader,
  instancesLoader,
  itemsLoader,
  organizationsLoader,
  peopleLoader,
  placesLoader,
  worksLoader,
} from "./api";

const loaderDict = {
  events: eventsLoader,
  instances: instancesLoader,
  items: itemsLoader,
  organizations: organizationsLoader,
  people: peopleLoader,
  places: placesLoader,
  works: worksLoader,
};

export function coreDataLoader(options: {
  projectId: number | number[] | string | string[];
  model: string;
  getRelations?: boolean;
}): Loader {
  return {
    name: "core-data-loader",
    load: async (context: LoaderContext): Promise<void> => {
      const { generateDigest, logger, parseData, store } = context;
      const startTime = Date.now();
      logger.info("Loading item data");
      const response = await loaderDict[options.model](options, logger);
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
