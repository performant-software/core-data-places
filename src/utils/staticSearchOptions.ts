/**
 * Builds the ItemsJS options for a static search.
 *
 * `scripts/build.search.mjs` imports this file directly using Node's type stripping, so it can only use type imports
 * and erasable TypeScript syntax.
 */
import type { ItemsJsOptions } from '@utils/staticSearch';

interface StaticSearch {
  facets?: Array<{ name: string }>;
  route: string;
  timeline?: { date_range_facet?: string };
}

/**
 * Core Data content collections that a static search can be generated from.
 */
export const COLLECTIONS = [
  'events',
  'instances',
  'items',
  'organizations',
  'people',
  'places',
  'works'
] as const;

export type Collection = typeof COLLECTIONS[number];

export const FACET_SUFFIX = '_facet';

/**
 * Number of values ItemsJS returns for each facet.
 */
const FACET_SIZE = 20;

/**
 * Top-level document fields that are never full-text searched.
 */
const UNSEARCHABLE_FIELDS = ['id', 'uuid'];

export const SORTINGS: ItemsJsOptions['sortings'] = {
  name_asc: { field: 'name', order: 'asc' },
  name_desc: { field: 'name', order: 'desc' }
};

/**
 * Returns the content collection for the passed search, e.g. "/places" -> "places".
 */
export const getCollectionName = (search: StaticSearch): Collection | undefined => (
  COLLECTIONS.find((collection) => search.route === `/${collection}`)
);

/**
 * Returns an aggregation for each configured facet, plus a range aggregation for the timeline.
 */
export const getAggregations = (search: StaticSearch): ItemsJsOptions['aggregations'] => {
  const aggregations: ItemsJsOptions['aggregations'] = {};

  for (const { name } of search.facets || []) {
    aggregations[name] = { size: FACET_SIZE, conjunction: false };
  }

  if (search.timeline?.date_range_facet) {
    aggregations[search.timeline.date_range_facet] = { show_facet_stats: true };
  }

  return aggregations;
};

const isText = (value: unknown) => typeof value === 'string'
  || (Array.isArray(value) && value.some((item) => typeof item === 'string'));

/**
 * Returns the top-level document fields that hold text, excluding the IDs and the facet copies.
 */
export const getSearchableFields = (documents: Array<{ [key: string]: unknown }>) => {
  const fields = new Set<string>();

  for (const document of documents) {
    for (const [key, value] of Object.entries(document)) {
      if (!UNSEARCHABLE_FIELDS.includes(key) && !key.endsWith(FACET_SUFFIX) && isText(value)) {
        fields.add(key);
      }
    }
  }

  return [...fields];
};

export const buildOptions = (
  search: StaticSearch,
  documents: Array<{ [key: string]: unknown }>
): ItemsJsOptions => ({
  aggregations: getAggregations(search),
  searchableFields: getSearchableFields(documents),
  sortings: SORTINGS
});
