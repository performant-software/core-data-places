import { toField } from '@utils/staticSearchOptions';
import _ from 'underscore';

const SEARCH_PATH = '/search';

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
  data: `${SEARCH_PATH}/${indexName}/data.json`,
  options: `${SEARCH_PATH}/${indexName}/options.json`
});

export type WorkerRequest =
  | { type: 'load', indexName: string, geoLocationField: string }
  | { type: 'search', id: number, queries: Array<any> }
  | { type: 'searchForFacetValues', id: number, queries: Array<any> };

export type WorkerResponse =
  | { type: 'loaded', options: ItemsJsOptions }
  | { type: 'loadFailed', message: string }
  | { type: 'results', id: number, response: any }
  | { type: 'searchFailed', id: number, message: string }
  | { type: 'facetValues', id: number, response: any }
  | { type: 'facetValuesFailed', id: number, message: string };

export type SearchWorker = Pick<Worker, 'addEventListener' | 'postMessage' | 'removeEventListener'>;

interface Waiter {
  resolve: (response: any) => void;
  reject: (error: Error) => void;
}

/**
 * Returns the passed options with the aggregations keyed by document field, which is what ItemsJS indexes them by.
 * The options file keeps the configured facet names, which InstantSearch uses as the attributes.
 */
export const getIndexOptions = (options: ItemsJsOptions): ItemsJsOptions => ({
  ...options,
  aggregations: _.object(_.map(options.aggregations || {}, (aggregation, name) => [toField(name), aggregation]))
});

/**
 * Replaces the attribute at the start of a facet or numeric filter, e.g. "names_facet:Paris" -> "names:Paris".
 */
const toFieldFilter = (filter: string) => filter.replace(/^[^:<=!>]+/, (attribute) => toField(attribute));

const toFieldFilters = (filters: Array<string | string[]>) => _.map(filters, (filter) => (
  _.isArray(filter) ? _.map(filter, toFieldFilter) : toFieldFilter(filter)
));

/**
 * Converts the InstantSearch queries into the ones the adapter passes to ItemsJS:
 *
 * - The adapter reads `params.facets` unconditionally, but InstantSearch omits it when no facets are requested.
 * - The facets and filters use the configured attributes, which are mapped to the document fields.
 */
export const normalizeQueries = (queries: Array<any>) => _.map(queries, (query: any) => {
  const { facetFilters, numericFilters } = query.params || {};

  return {
    ...query,
    params: {
      ...query.params,
      facets: _.map(query.params?.facets || [], toField),
      ...(_.isArray(facetFilters) ? { facetFilters: toFieldFilters(facetFilters) } : {}),
      ...(_.isArray(numericFilters) ? { numericFilters: toFieldFilters(numericFilters) } : {})
    }
  };
});

export const normalizeFacetValuesQueries = (queries: Array<any>) => _.map(queries, (query: any) => {
  const { facetFilters, facetName, numericFilters } = query.params || {};

  return {
    ...query,
    params: {
      ...query.params,
      facetName: toField(facetName),
      ...(_.isArray(facetFilters) ? { facetFilters: toFieldFilters(facetFilters) } : {}),
      ...(_.isArray(numericFilters) ? { numericFilters: toFieldFilters(numericFilters) } : {})
    }
  };
});

/**
 * Keys the facet values and stats in the adapter's response by the attributes each query requested, reversing
 * `normalizeQueries`.
 */
export const denormalizeResponse = (queries: Array<any>, response: any) => ({
  ...response,
  results: _.map(response.results, (result: any, index: number) => {
    const attributes = _.indexBy(queries[index]?.params?.facets || [], toField);

    const toAttributes = (values?: { [field: string]: any }) => values && _.object(_.map(
      values,
      (value, field) => [attributes[field] || field, value]
    ));

    return {
      ...result,
      facets: toAttributes(result.facets),
      facets_stats: toAttributes(result.facets_stats)
    };
  })
});

/**
 * Returns the passed response with the passed function applied to the hits of each result.
 */
const mapHits = (response: any, iteratee: (hit: any) => any) => ({
  ...response,
  results: _.map(response.results, (result: any) => (
    result.hits ? { ...result, hits: _.map(result.hits, iteratee) } : result
  ))
});

/**
 * Returns true if any value in the passed highlight result matched the query.
 */
const hasMatch = (highlight: any): boolean => {
  if (_.isArray(highlight)) {
    return _.some(highlight, hasMatch);
  }

  if (!_.isObject(highlight)) {
    return false;
  }

  if (_.has(highlight, 'matchLevel')) {
    return (highlight as any).matchLevel !== 'none';
  }

  return _.some(highlight, hasMatch);
};

/**
 * Removes the top-level attributes with no matches from each hit's `_highlightResult`, since the adapter includes an
 * escaped copy of every attribute whether or not it matched (or whether there's a query at all). This keeps the
 * response posted from the worker small; `backfillHighlights` restores the removed attributes.
 */
export const pruneHighlights = (response: any) => mapHits(response, (hit) => {
  const { _highlightResult: highlightResult, ...rest } = hit;
  const matched = _.pick(highlightResult || {}, hasMatch);

  return _.isEmpty(matched) ? rest : { ...rest, _highlightResult: matched };
});

/**
 * Returns the unmatched highlight result for the passed value, in the same shape as the adapter. Like the adapter, the
 * value is left unescaped because InstantSearch's hits connector escapes it.
 */
const toHighlight = (value: any): any => {
  if (_.isArray(value)) {
    return _.map(value, toHighlight);
  }

  if (_.isObject(value)) {
    return _.omit(_.mapObject(value, toHighlight), _.isUndefined);
  }

  if (_.isString(value) || _.isNumber(value) || _.isBoolean(value)) {
    return { value: String(value), matchLevel: 'none', matchedWords: [] };
  }

  return undefined;
};

/**
 * Restores the attributes removed from each hit's `_highlightResult` by `pruneHighlights`, which InstantSearch's
 * `Highlight` needs to render the unmatched values.
 */
export const backfillHighlights = (response: any) => mapHits(response, (hit) => {
  const highlightResult = { ...hit._highlightResult };

  _.each(hit, (value, key) => {
    if (key !== 'objectID' && !key.startsWith('_') && !_.has(highlightResult, key)) {
      const highlight = toHighlight(value);

      if (!_.isUndefined(highlight)) {
        highlightResult[key] = highlight;
      }
    }
  });

  return { ...hit, _highlightResult: highlightResult };
});

/**
 * Asks the worker to fetch and index the named search index, resolving with the ItemsJS options. The map bounds
 * filter reads locations from the passed field.
 */
export const loadIndex = (
  worker: SearchWorker,
  indexName: string,
  geoLocationField: string
) => new Promise<ItemsJsOptions>((resolve, reject) => {
  const onMessage = ({ data }: MessageEvent<WorkerResponse>) => {
    if (data.type === 'loaded') {
      resolve(data.options);
    } else if (data.type === 'loadFailed') {
      reject(new Error(data.message));
    } else {
      return;
    }

    worker.removeEventListener('message', onMessage);
  };

  worker.addEventListener('message', onMessage);
  worker.postMessage({ type: 'load', indexName, geoLocationField } as WorkerRequest);
});

export const createStaticSearchClient = (worker: SearchWorker) => {
  let nextId = 0;
  let running: { id: number, waiters: Waiter[] } | null = null;
  let queued: { queries: Array<any>, waiters: Waiter[] } | null = null;

  const facetValueWaiters = new Map<number, Waiter>();

  const send = (queries: Array<any>, waiters: Waiter[]) => {
    running = { id: nextId++, waiters };
    worker.postMessage({ type: 'search', id: running.id, queries } as WorkerRequest);
  };

  worker.addEventListener('message', ({ data }: MessageEvent<WorkerResponse>) => {
    if (data.type === 'facetValues' || data.type === 'facetValuesFailed') {
      const waiter = facetValueWaiters.get(data.id);
      facetValueWaiters.delete(data.id);

      if (data.type === 'facetValues') {
        waiter?.resolve(data.response);
      } else {
        waiter?.reject(new Error(data.message));
      }

      return;
    }

    if ((data.type !== 'results' && data.type !== 'searchFailed') || data.id !== running?.id) {
      return;
    }

    const { waiters } = running;
    running = null;

    if (queued) {
      send(queued.queries, queued.waiters);
      queued = null;
    }

    const response = data.type === 'results' ? backfillHighlights(data.response) : null;

    const settle = (waiter: Waiter) => (data.type === 'results'
      ? waiter.resolve(response)
      : waiter.reject(new Error(data.message)));

    settle(_.last(waiters)!);
    setTimeout(() => _.each(_.initial(waiters), settle));
  });

  return {
    search: (queries: Array<any>) => new Promise<any>((resolve, reject) => {
      const waiter = { resolve, reject };

      if (running) {
        queued = { queries, waiters: [...(queued?.waiters || []), waiter] };
      } else {
        send(queries, [waiter]);
      }
    }),
    searchForFacetValues: (queries: Array<any>) => new Promise<any>((resolve, reject) => {
      const id = nextId++;

      facetValueWaiters.set(id, { resolve, reject });
      worker.postMessage({ type: 'searchForFacetValues', id, queries } as WorkerRequest);
    })
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
