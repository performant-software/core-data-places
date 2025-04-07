import ServiceFactory from '@services/coreData/factory';
import _ from 'underscore';

/**
 * Returns the Response object for the passed data.
 *
 * @param data
 */
export const buildResponse = (data) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  const status = 200;

  return new Response(JSON.stringify(data), { status, headers });
};

interface Params {
  [key: string]: string
};

/**
 * Builds the API static paths.
 *
 * @param params
 */
export const buildStaticPaths = async (params: Params = {}) => {
  const routes = [];

  const models = ServiceFactory.getModels();

  for (const model of models) {
    const service = ServiceFactory.getService(model);
    const records = await service.getAll();

    _.each(records[model], ({ uuid }) => {
      console.log(model, uuid);
      routes.push({ params: { model, uuid, ...params } });
    });
  }

  return routes;
};