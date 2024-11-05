/**
 * Note: Due to a bug with using Typescript "paths" in tsconfig in TinaCMS, this file is simply a copy of
 * @backend/core-data.ts. Hopefully in the future this can be removed.
 *
 * https://github.com/tinacms/tinacms/issues/4654
 */

import config from '../../public/config.json';
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