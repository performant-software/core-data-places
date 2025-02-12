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

export const organizationLoader = (uuid: string, withRelations: boolean = true) => {
  const response = fetchItemData("organizations", uuid);
  if (!withRelations) {
    return response;
  }
  const relations = getRelations("organizations", uuid);
  return ( { ...response, relatedRecords: relations } );
}

export default organizationsLoader;