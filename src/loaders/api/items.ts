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

export const itemLoader = (uuid: string) => {
  const response = fetchItemData("items", uuid);
  const relations = getRelations("items", uuid);
  return ( { data: { ...response, relatedRecords: relations } } );
}

export default itemsLoader;