import { fetchModelData } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const eventsLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "events" }, logger);
};

export default eventsLoader;
