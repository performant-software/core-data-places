import config from '@config';
import _ from 'underscore';

const buildSearchParameters = (params: any) => {
  const searchParams = new URLSearchParams(params);

  _.each(config.core_data.project_ids, (projectId: number) => {
    searchParams.append('project_ids[]', projectId.toString());
  });

  return searchParams.toString();
};

export const getPlacesURL = (params = {}) => {
  const url = `${config.core_data.url}/core_data/public/v1/places`;
  const searchParams = buildSearchParameters(params);

  return `${url}?${searchParams}`;
};

export const getPlaceURL = (id: string, params = {}) => {
  const url = `${config.core_data.url}/core_data/public/v1/places/${id}`;
  const searchParams = buildSearchParameters(params);

  return `${url}?${searchParams}`;
};