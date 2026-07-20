// src/lib/islands.ts
import type { IslandRegistry } from '@tinacms/astro/experimental';
import type { QueryResult } from '@tinacms/astro/data';
import { fetchPageResponse } from '@backend/tina';
import { PagesQuery } from '@root/tina/__generated__/types';
import Page from '@apps/pages/Page.astro';
import { getTranslations } from '@backend/i18n';
import config from '@config';

const { t } = await getTranslations(config.i18n.default_locale);

export const islands: IslandRegistry = {
  page: {
    fetch: (_request, params) => fetchPageResponse(params.get('lang') || 'en', params.get('slug') ?? 'home', true),
    component: Page,
    wrapper: { tag: 'main' },
    propsFromData: (data) => ({
      page: (data as QueryResult<PagesQuery>).data?.pages,
      isTinaPreview: true,
      t
    }),
  }
};