import { fetchItemData, fetchModelData, getRelations } from '@loaders/api/helpers';
import { AstroIntegrationLogger } from 'astro';

const itemsLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: 'items' }, logger);
};

export const itemLoader = async (uuid: string, withRelations: boolean = true) => {
  const response = await fetchItemData('items', uuid);
  if (!withRelations) {
    return response;
  }
  const relations = await getRelations('items', uuid);
  return ( { ...response.item, relatedRecords: relations } );
}

export default itemsLoader;