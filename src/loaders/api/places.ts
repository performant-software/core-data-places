import { fetchModelData } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const placesLoader = async (
  options: {
    projectId: number | number[] | string | string[];
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "places" }, logger);
};

export default placesLoader;
