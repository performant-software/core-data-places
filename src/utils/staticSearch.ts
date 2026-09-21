import { createIndex, getSearchClient } from 'instantsearch-itemsjs-adapter';
import _ from 'underscore';

const SEARCH_PATH = '/search';

const CONFIG_SUFFIX = '.itemsjs.json';

export interface ItemsJsAggregation {
  title?: string;
  size?: number;
  conjunction?: boolean;
  show_facet_stats?: boolean;
}

export interface ItemsJsSorting {
  field: string;
  order: 'asc' | 'desc';
  title?: string;
}

export interface ItemsJsOptions {
  aggregations?: {
    [name: string]: ItemsJsAggregation
  };
  searchableFields: string[];
  sortings?: {
    [name: string]: ItemsJsSorting
  };
}

export const getIndexUrls = (indexName: string) => ({
  data: `${SEARCH_PATH}/${indexName}.json`,
  options: `${SEARCH_PATH}/${indexName}${CONFIG_SUFFIX}`
});

export const loadIndex = async (indexName: string) => {
  const urls = getIndexUrls(indexName);

  const [data, options] = await Promise.all([
    fetch(urls.data).then((response) => response.json()),
    fetch(urls.options).then((response) => response.json())
  ]);

  // ItemsJS requires a `query` key, but InstantSearch supplies the actual query per-request.
  const index = createIndex(data, { ...options, query: '' });

  return { index, options: options as ItemsJsOptions };
};

export const createStaticSearchClient = (index: any) => {
  const client = getSearchClient(index);

  return {
    ...client,
    search: (queries: Array<any>) => client.search(_.map(queries, (query: any) => ({
      ...query,
      params: {
        ...query.params,
        facets: query.params?.facets || []
      }
    })))
  };
};

const isValid = (name: string, facets: { exclude?: string[], include?: string[] } = {}) => {
  if (!_.isEmpty(facets.include)) {
    return _.contains(facets.include, name);
  }

  if (!_.isEmpty(facets.exclude)) {
    return !_.contains(facets.exclude, name);
  }

  return true;
};

export const getFacetAttributes = (
  options: ItemsJsOptions,
  facets?: { exclude?: string[], include?: string[] }
) => {
  const aggregations = options?.aggregations || {};
  const names = _.filter(_.keys(aggregations), (name: string) => isValid(name, facets));

  const [rangeAttributes, attributes] = _.partition(
    names,
    (name: string) => !!aggregations[name]?.show_facet_stats
  );

  return { attributes, rangeAttributes };
};

const ORDER_DESCENDING = 'desc';

const getSortingLabel = ({ field, order }: ItemsJsSorting) => {
  const name = field
    .split(/[._]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return `${name} (${order === ORDER_DESCENDING ? 'Z-A' : 'A-Z'})`;
};

export const getSortings = (options: ItemsJsOptions, t: (key: string) => string) => {
  const sortings = options?.sortings || {};

  return _.map(_.keys(sortings), (value: string) => {
    const sorting = sortings[value];

    return {
      label: t(value) || sorting.title || getSortingLabel(sorting),
      value
    };
  });
};
