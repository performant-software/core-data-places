import { fetchItemData, fetchModelData, getRelations } from '@loaders/api/helpers';
import { AstroIntegrationLogger } from 'astro';

const placesLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: 'places' }, logger);
};

export const placeLoader = async (uuid: string, withRelations: boolean = true) => {
  const response = await fetchItemData('places', uuid);
  if (!withRelations) {
    return response;
  }
  const relations = await getRelations('places', uuid);
  return ( { ...response, relatedRecords: relations } );
}

export default placesLoader;