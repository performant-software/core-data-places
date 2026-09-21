import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import type { Configuration, SearchConfig } from '@types';
import _ from 'underscore';

// todo: update the upstream normalizeConfig from react-components
export const normalizeConfig = (config: Configuration) => {
  const searches = config.search || [];

  const normalized = PeripleoUtils.normalize({
    ...config,
    search: _.map(searches, (search) => (search.typesense ? search : { ...search, typesense: {} }))
  });

  return {
    ...normalized,
    search: _.map(normalized.search, (search: SearchConfig, index: number) => (
      searches[index]?.typesense ? search : _.omit(search, 'typesense')
    ))
  };
};
