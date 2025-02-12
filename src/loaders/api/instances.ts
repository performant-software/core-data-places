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

export const instanceLoader = (uuid: string, withRelations: boolean = true) => {
  const response = fetchItemData("instances", uuid);
  if (!withRelations) {
    return response;
  }
  const relations = getRelations("instances", uuid);
  return ( { ...response, relatedRecords: relations } );
}

export default instancesLoader;