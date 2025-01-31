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

export const eventLoader = (uuid: string) => {
  const response = fetchItemData("events", uuid);
  const relations = getRelations("events", uuid);
  return ( { data: { ...response, relatedRecords: relations } } );
}

export default eventsLoader;
