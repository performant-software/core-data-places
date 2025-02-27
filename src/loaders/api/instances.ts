import { fetchItemData, fetchModelData, getRelations } from '@loaders/api/helpers';
import { AstroIntegrationLogger } from 'astro';

const instancesLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: 'instances' }, logger);
};

export const instanceLoader = async (uuid: string, withRelations: boolean = true) => {
  const response = await fetchItemData('instances', uuid);
  if (!withRelations) {
    return response;
  }
  const relations = await getRelations('instances', uuid);
  return ( { ...response, relatedRecords: relations } );
}

export default instancesLoader;