import { fetchModelData } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const organizationsLoader = async (
  options: {
    projectId: number | number[] | string | string[];
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "organizations" }, logger);
};

export default organizationsLoader;
