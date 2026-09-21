import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createStaticSearchClient,
  getFacetAttributes,
  getIndexUrls,
  getSortings
} from '../src/utils/staticSearch';

const search = vi.fn();

vi.mock('instantsearch-itemsjs-adapter', () => ({
  createIndex: vi.fn(),
  getSearchClient: () => ({ search, searchForFacetValues: vi.fn() })
}));

const options = {
  searchableFields: ['title', 'author'],
  aggregations: {
    author: { title: 'Author', size: 20, conjunction: false },
    subject: { title: 'Subject', size: 20, conjunction: false },
    date_normalised: { show_facet_stats: true }
  },
  sortings: {
    title_asc: { field: 'title', order: 'asc' as const },
    title_desc: { field: 'title', order: 'desc' as const },
    date_asc: { field: 'date_normalised', order: 'asc' as const, title: 'Oldest first' }
  }
};

describe('getIndexUrls', () => {
  it('points at the files copied into /public by build.search.mjs', () => {
    expect(getIndexUrls('catalogue')).toEqual({
      data: '/search/catalogue.json',
      options: '/search/catalogue.itemsjs.json'
    });
  });
});

describe('getFacetAttributes', () => {
  it('splits aggregations into list and range attributes', () => {
    const { attributes, rangeAttributes } = getFacetAttributes(options);

    expect(attributes).toEqual(['author', 'subject']);
    expect(rangeAttributes).toEqual(['date_normalised']);
  });

  it('limits facets to the include list, in no particular order', () => {
    const { attributes, rangeAttributes } = getFacetAttributes(options, { include: ['subject'] });

    expect(attributes).toEqual(['subject']);
    expect(rangeAttributes).toEqual([]);
  });

  it('drops facets in the exclude list', () => {
    const { attributes } = getFacetAttributes(options, { exclude: ['author'] });

    expect(attributes).toEqual(['subject']);
  });

  it('prefers include over exclude, matching the Typesense provider', () => {
    const { attributes } = getFacetAttributes(options, {
      exclude: ['author'],
      include: ['author', 'subject']
    });

    expect(attributes).toEqual(['author', 'subject']);
  });

  it('returns empty attributes when the configuration declares no aggregations', () => {
    expect(getFacetAttributes({ searchableFields: [] })).toEqual({
      attributes: [],
      rangeAttributes: []
    });
  });
});

describe('getSortings', () => {
  const noTranslations = () => undefined as unknown as string;

  it('uses the ItemsJS sorting key as the SortBy value', () => {
    const sortings = getSortings(options, noTranslations);

    expect(sortings.map(({ value }) => value)).toEqual(['title_asc', 'title_desc', 'date_asc']);
  });

  it('derives a label when the sorting carries no title', () => {
    const sortings = getSortings(options, noTranslations);

    expect(sortings[0].label).toEqual('Title (A-Z)');
    expect(sortings[1].label).toEqual('Title (Z-A)');
  });

  it('prefers the configured title over a derived label', () => {
    const sortings = getSortings(options, noTranslations);

    expect(sortings[2].label).toEqual('Oldest first');
  });

  it('prefers a translation over both', () => {
    const t = (key: string) => (key === 'title_asc' ? 'A to Z' : undefined as unknown as string);
    const sortings = getSortings(options, t);

    expect(sortings[0].label).toEqual('A to Z');
    expect(sortings[2].label).toEqual('Oldest first');
  });

  it('returns no options when the configuration declares no sortings', () => {
    expect(getSortings({ searchableFields: [] }, noTranslations)).toEqual([]);
  });
});

describe('createStaticSearchClient', () => {
  beforeEach(() => {
    search.mockReset().mockResolvedValue({ results: [] });
  });

  it('defaults the facets param, which the adapter reads unconditionally', async () => {
    const client = createStaticSearchClient({});
    await client.search([{ indexName: 'catalogue', params: { query: 'a' } }]);

    expect(search).toHaveBeenCalledWith([
      { indexName: 'catalogue', params: { query: 'a', facets: [] } }
    ]);
  });

  it('defaults the facets param when the request has no params at all', async () => {
    const client = createStaticSearchClient({});
    await client.search([{ indexName: 'catalogue' }]);

    expect(search).toHaveBeenCalledWith([
      { indexName: 'catalogue', params: { facets: [] } }
    ]);
  });

  it('leaves an existing facets param alone', async () => {
    const client = createStaticSearchClient({});
    await client.search([{ indexName: 'catalogue', params: { facets: ['author'] } }]);

    expect(search).toHaveBeenCalledWith([
      { indexName: 'catalogue', params: { facets: ['author'] } }
    ]);
  });
});
