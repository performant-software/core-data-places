import { fetchItemData, fetchModelData, getRelations } from "./helpers";
import { AstroIntegrationLogger } from "astro";

const worksLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: "works" }, logger);
};

export const workLoader = (uuid: string, withRelations: boolean = true) => {
  const response = fetchItemData("works", uuid);
  if (!withRelations) {
    return response;
  }
  const relations = getRelations("works", uuid);
  return ( { ...response, relatedRecords: relations } );
}

export default worksLoader;