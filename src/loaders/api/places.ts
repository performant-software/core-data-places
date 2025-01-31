import { fetchItemData, fetchModelData, getRelations } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const placesLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "places" }, logger);
};

export const placeLoader = (uuid: string) => {
  const response = fetchItemData("places", uuid);
  const relations = getRelations("places", uuid);
  return ( { data: { ...response, relatedRecords: relations } } );
}

export default placesLoader;