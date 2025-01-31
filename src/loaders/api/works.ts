import { fetchModelData } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const worksLoader = async (
  options: {
    projectId: number | number[] | string | string[];
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "works" }, logger);
};

export default worksLoader;
