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

export const itemLoader = async (uuid: string, withRelations: boolean = true) => {
  const response = await fetchItemData("items", uuid);
  if (!withRelations) {
    return response;
  }
  const relations = await getRelations("items", uuid);
  return ( { ...response, relatedRecords: relations } );
}

export default itemsLoader;