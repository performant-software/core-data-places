import { describe, expect, test, vi } from 'vitest';

vi.mock('@config', () => ({
  default: {
    i18n: { locales: ['en', 'fr'] },
    detail_pages: { models: { people: {} } }
  }
}));

vi.mock('@services/coreData/factory', () => ({
  default: {
    getService: (model: string) => ({
      getAll: async () => ({ [model]: [{ uuid: 'a' }, { uuid: 'b' }] })
    })
  }
}));

import { getDetailPagePaths } from '@utils/detailPages';

describe('getDetailPagePaths', () => {
  test('returns one route per record per locale for a model with a configured detail page', async () => {
    const routes = await getDetailPagePaths('people' as any);

    expect(routes).toHaveLength(4);
    expect(routes).toContainEqual({ params: { lang: 'en', uuid: 'a' } });
    expect(routes).toContainEqual({ params: { lang: 'fr', uuid: 'b' } });
  });

  test('returns no routes for a model without a configured detail page', async () => {
    const routes = await getDetailPagePaths('places' as any);

    expect(routes).toEqual([]);
  });
});
