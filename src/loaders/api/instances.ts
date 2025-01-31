import { fetchModelData } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const instancesLoader = async (
  options: {
    projectId: number | number[] | string | string[];
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "instances" }, logger);
};

export default instancesLoader;
