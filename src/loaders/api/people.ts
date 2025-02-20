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

export const personLoader = async (uuid: string, withRelations: boolean = true) => {
  const response = await fetchItemData("people", uuid);
  if (!withRelations) {
    return response;
  }
  const relations = await getRelations("people", uuid);
  return ( { ...response, relatedRecords: relations } );
}

export default peopleLoader;
