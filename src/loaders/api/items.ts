import { fetchItemData, fetchModelData, getRelations } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const itemsLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "items" }, logger);
};

export const itemLoader = (uuid: string, withRelations: boolean = true) => {
  const response = fetchItemData("items", uuid);
  if (!withRelations) {
    return response;
  }
  const relations = getRelations("items", uuid);
  return ( { ...response, relatedRecords: relations } );
}

export default itemsLoader;