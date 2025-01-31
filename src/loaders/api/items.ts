import { fetchModelData } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const itemsLoader = async (
  options: {
    projectId: number | number[] | string | string[];
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "items" }, logger);
};

export default itemsLoader;
