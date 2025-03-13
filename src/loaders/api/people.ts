import { fetchItemData, fetchModelData, getRelations } from '@loaders/api/helpers';
import { AstroIntegrationLogger } from 'astro';

const peopleLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: 'people' }, logger);
};

export const personLoader = async (uuid: string, withRelations: boolean = true) => {
  const response = await fetchItemData('people', uuid);
  if (!withRelations) {
    return response;
  }
  const relations = await getRelations('people', uuid);
  return ( { ...response.person, relatedRecords: relations } );
}

export default peopleLoader;
