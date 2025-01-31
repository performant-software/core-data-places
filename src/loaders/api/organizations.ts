import { fetchItemData, fetchModelData, getRelations } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const organizationsLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "organizations" }, logger);
};

export const organizationLoader = (uuid: string) => {
  const response = fetchItemData("organizations", uuid);
  const relations = getRelations("organizations", uuid);
  return ( { data: { ...response, relatedRecords: relations } } );
}

export default organizationsLoader;