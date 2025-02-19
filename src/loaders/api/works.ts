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

export const workLoader = async (uuid: string, withRelations: boolean = true) => {
  const response = await fetchItemData("works", uuid);
  if (!withRelations) {
    return response;
  }
  const relations = await getRelations("works", uuid);
  return ( { ...response, relatedRecords: relations } );
}

export default worksLoader;