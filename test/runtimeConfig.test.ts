import { describe, expect, it, vi } from 'vitest';

/**
 * Stands in for `Peripleo.normalize`, which is imported from `@performant-software/core-data`
 * and cannot be loaded here: the package reaches for `window` at import time. The mock keeps
 * the one line of upstream behaviour this module exists to work around, namely the
 * unconditional read of `search.typesense`.
 */
vi.mock('@performant-software/core-data', () => ({
  Peripleo: {
    normalize: (config: any) => ({
      ...config,
      search: config.search.map((search: any) => ({
        ...search,
        typesense: {
          ...search.typesense,
          port: search.typesense.port || '443',
          protocol: search.typesense.protocol || 'https'
        }
      }))
    })
  }
}));

const { normalizeConfig } = await import('../src/utils/runtimeConfig');

const staticSearch = {
  name: 'catalogue',
  route: '/items',
  static: {
    index_name: 'catalogue'
  }
};

const typesenseSearch = {
  name: 'people',
  route: '/people',
  typesense: {
    host: 'search.example.com',
    api_key: 'abc',
    index_name: 'people',
    query_by: 'name'
  }
};

describe('normalizeConfig', () => {
  it('normalizes a static search without Typesense settings', () => {
    const normalized: any = normalizeConfig({ search: [staticSearch] } as any);

    expect(normalized.search[0].static).toEqual({ index_name: 'catalogue' });
    expect(normalized.search[0].typesense).toBeUndefined();
  });

  it('normalizes the Typesense searches alongside a static search', () => {
    const normalized: any = normalizeConfig({ search: [staticSearch, typesenseSearch] } as any);

    expect(normalized.search[0].typesense).toBeUndefined();
    expect(normalized.search[1].typesense.port).toEqual('443');
    expect(normalized.search[1].typesense.protocol).toEqual('https');
    expect(normalized.search[1].typesense.index_name).toEqual('people');
  });

  it('normalizes a configuration without any searches', () => {
    const normalized: any = normalizeConfig({} as any);

    expect(normalized.search).toEqual([]);
  });
});
