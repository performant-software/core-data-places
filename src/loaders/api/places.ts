import { fetchModelData } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const placesLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "places" }, logger);
};

export default placesLoader;
