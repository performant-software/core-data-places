// src/lib/islands.ts
import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';
import { fetchPageResponse } from '@backend/tina';
import { PagesQuery } from '@root/tina/__generated__/types';
import Page from '@apps/pages/Page.astro';

export const islands: IslandRegistry = {
  page: {
    fetch: (_request, params) => fetchPageResponse(params.get('lang') || 'en', params.get('slug') ?? 'home', true),
    component: Page,
    wrapper: { tag: 'main' },
    propsFromData: (data) => ({
      page: (data as QueryResult<PagesQuery>).data?.pages,
      isTinaPreview: true
    }),
  }
};