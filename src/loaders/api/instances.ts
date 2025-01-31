import { fetchModelData } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const instancesLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "instances" }, logger);
};

export default instancesLoader;
