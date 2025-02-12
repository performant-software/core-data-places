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

export const placeLoader = (uuid: string, withRelations: boolean = true) => {
  const response = fetchItemData("places", uuid);
  if (!withRelations) {
    return response;
  }
  const relations = getRelations("places", uuid);
  return ( { ...response, relatedRecords: relations } );
}

export default placesLoader;