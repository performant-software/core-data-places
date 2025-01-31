import { fetchModelData } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const organizationsLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "organizations" }, logger);
};

export default organizationsLoader;
