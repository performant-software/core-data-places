import { fetchModelData } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const peopleLoader = async (
  options: {
    projectId: number | number[] | string | string[];
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "people" }, logger);
};

export default peopleLoader;
