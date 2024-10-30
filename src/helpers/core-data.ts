import _ from 'underscore';
import config from '../../public/config.json';

const buildSearchParameters = (params) => {
  const searchParams = new URLSearchParams(params);

  _.each(config.core_data.project_ids, (projectId) => {
    searchParams.append('project_ids[]', projectId.toString());
  });

  return searchParams.toString();
};

export const getPlacesURL = (params = {}) => {
  const url = `${config.core_data.url}/core_data/public/v1/places`;
  const searchParams = buildSearchParameters(params);

  return `${url}?${searchParams}`;
};

export const getPlaceURL = (id: number, params = {}) => {
  const url = `${config.core_data.url}/core_data/public/v1/places/${id}`;
  const searchParams = buildSearchParameters(params);

  return `${url}?${searchParams}`;
};