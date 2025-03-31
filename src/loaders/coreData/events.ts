import { fetchItemData, fetchModelData, getRelations } from '@loaders/coreData/helpers';
import { AstroIntegrationLogger } from 'astro';

const eventsLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: 'events' }, logger);
};

export const eventLoader = async (uuid: string, withRelations: boolean = true) => {
  const response = await fetchItemData('events', uuid);
  if (!withRelations) {
    return response;
  }
  const relations = await getRelations('events', uuid);
  return ( { ...response.event, relatedRecords: relations } );
}

export default eventsLoader;
