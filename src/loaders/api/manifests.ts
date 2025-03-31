import { fetchModelData } from '@loaders/api/helpers';
import { AstroIntegrationLogger } from 'astro';

const manifestsLoader = async (
  options: {
    getRelations?: boolean;
  },
  logger?: AstroIntegrationLogger
) => {
  return fetchModelData({ ...options, model: 'manifests' }, logger);
};

export default manifestsLoader;
