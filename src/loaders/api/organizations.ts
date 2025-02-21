import { fetchItemData, fetchModelData, getRelations } from '@loaders/api/helpers';
import { AstroIntegrationLogger } from 'astro';

const organizationsLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: 'organizations' }, logger);
};

export const organizationLoader = async (uuid: string, withRelations: boolean = true) => {
  const response = await fetchItemData('organizations', uuid);
  if (!withRelations) {
    return response;
  }
  const relations = await getRelations('organizations', uuid);
  return ( { ...response, relatedRecords: relations } );
}

export default organizationsLoader;