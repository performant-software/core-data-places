import { fetchItemData, fetchModelData, getRelations } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const eventsLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "events" }, logger);
};

export const eventLoader = (uuid: string, withRelations: boolean = true) => {
  const response = fetchItemData("events", uuid);
  if (!withRelations) {
    return response;
  }
  const relations = getRelations("events", uuid);
  return ( { ...response, relatedRecords: relations } );
}

export default eventsLoader;
