import { fetchModelData } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const eventsLoader = async (
  options: {
    projectId: number | number[] | string | string[];
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "events" }, logger);
};

export default eventsLoader;
