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

export const personLoader = (uuid: string) => {
  const response = fetchItemData("people", uuid);
  const relations = getRelations("people", uuid);
  return ( { data: { ...response, relatedRecords: relations } } );
}

export default peopleLoader;
