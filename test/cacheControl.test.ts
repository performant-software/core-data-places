import { beforeEach, describe, expect, it, vi } from 'vitest';

const env = {
  CACHE_CDN_MAX_AGE: 300,
  CACHE_STALE_WHILE_REVALIDATE: 604800,
  DISABLE_CACHE: false
};

vi.mock('astro:env/client', () => ({
  get CACHE_CDN_MAX_AGE() { return env.CACHE_CDN_MAX_AGE; },
  get CACHE_STALE_WHILE_REVALIDATE() { return env.CACHE_STALE_WHILE_REVALIDATE; },
  get DISABLE_CACHE() { return env.DISABLE_CACHE; }
}));

import { CACHE_TAG_CONTENT, setCacheControl } from '@utils/url';

describe('setCacheControl', () => {
  beforeEach(() => {
    env.CACHE_CDN_MAX_AGE = 300;
    env.CACHE_STALE_WHILE_REVALIDATE = 604800;
    env.DISABLE_CACHE = false;
  });

  it('sets the default headers, byte-identical to the pre-configurable values', () => {
    const headers = new Headers();
    setCacheControl(headers);

    expect(headers.get('Cache-Control')).toBe('public, max-age=0, must-revalidate');
    expect(headers.get('Netlify-CDN-Cache-Control'))
      .toBe('public, durable, s-maxage=300, stale-while-revalidate=604800');
  });

  it('tags the response for publish-triggered purging', () => {
    const headers = new Headers();
    setCacheControl(headers);

    expect(headers.get('Netlify-Cache-Tag')).toBe(CACHE_TAG_CONTENT);
  });

  it('builds the CDN header from the CACHE_* env values', () => {
    env.CACHE_CDN_MAX_AGE = 86400;
    env.CACHE_STALE_WHILE_REVALIDATE = 3600;

    const headers = new Headers();
    setCacheControl(headers);

    expect(headers.get('Netlify-CDN-Cache-Control'))
      .toBe('public, durable, s-maxage=86400, stale-while-revalidate=3600');
    expect(headers.get('Cache-Control')).toBe('public, max-age=0, must-revalidate');
  });

  it('sets nothing when DISABLE_CACHE is on', () => {
    env.DISABLE_CACHE = true;

    const headers = new Headers();
    setCacheControl(headers);

    expect(headers.get('Cache-Control')).toBeNull();
    expect(headers.get('Netlify-CDN-Cache-Control')).toBeNull();
    expect(headers.get('Netlify-Cache-Tag')).toBeNull();
  });
});
