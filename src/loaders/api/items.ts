import { fetchModelData } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const itemsLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "items" }, logger);
};

export default itemsLoader;
