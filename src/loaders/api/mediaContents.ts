import { fetchModelData } from '@loaders/api/helpers';
import { AstroIntegrationLogger } from 'astro';

const mediaContentsLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: 'media_contents' }, logger);
};

export default mediaContentsLoader;