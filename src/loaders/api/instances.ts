import { fetchItemData, fetchModelData, getRelations } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const instancesLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "instances" }, logger);
};

export const instanceLoader = (uuid: string) => {
  const response = fetchItemData("instances", uuid);
  const relations = getRelations("instances", uuid);
  return ( { data: { ...response, relatedRecords: relations } } );
}

export default instancesLoader;