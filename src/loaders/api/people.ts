import { fetchItemData, fetchModelData, getRelations } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const peopleLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "people" }, logger);
};

export const personLoader = (uuid: string, withRelations: boolean = true) => {
  const response = fetchItemData("people", uuid);
  if (!withRelations) {
    return response;
  }
  const relations = getRelations("people", uuid);
  return ( { ...response, relatedRecords: relations } );
}

export default peopleLoader;
