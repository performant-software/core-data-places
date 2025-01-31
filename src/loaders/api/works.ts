import { fetchModelData } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const worksLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "works" }, logger);
};

export default worksLoader;
