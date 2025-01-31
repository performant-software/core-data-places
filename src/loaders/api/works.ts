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

export const workLoader = (uuid: string) => {
  const response = fetchItemData("works", uuid);
  const relations = getRelations("works", uuid);
  return ( { data: { ...response, relatedRecords: relations } } );
}

export default worksLoader;