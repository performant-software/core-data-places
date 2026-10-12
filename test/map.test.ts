import { beforeEach, describe, expect, it, vi } from 'vitest';

const env = {
  STATIC_BUILD: false
};

vi.mock('astro:env/client', () => ({
  get STATIC_BUILD() { return env.STATIC_BUILD; }
}));

import { resolveLayer, resolveLayers } from '@utils/map';

const live = {
  name: 'Basemap',
  layer_type: 'vector' as const,
  url: 'https://api.maptiler.com/maps/dataviz/style.json?key=abc'
};

const withStatic = {
  ...live,
  static: {
    url: '/maps/style.json'
  }
};

describe('resolveLayer', () => {
  beforeEach(() => {
    env.STATIC_BUILD = false;
  });

  it('keeps the url when the site is not a static build', () => {
    expect(resolveLayer(withStatic).url).toBe(live.url);
  });

  it('uses the static url for static builds', () => {
    env.STATIC_BUILD = true;

    const layer = resolveLayer(withStatic);

    expect(layer.url).toBe('/maps/style.json');
    expect(layer.name).toBe('Basemap');
    expect(layer.layer_type).toBe('vector');
  });

  it('keeps the url for static builds when the layer has no static url', () => {
    env.STATIC_BUILD = true;

    expect(resolveLayer(live)).toBe(live);
    expect(resolveLayer({ ...live, static: {} }).url).toBe(live.url);
    expect(resolveLayer({ ...live, static: { url: '' } }).url).toBe(live.url);
  });

  it('does not change the layer it is passed', () => {
    env.STATIC_BUILD = true;

    resolveLayer(withStatic);

    expect(withStatic.url).toBe(live.url);
  });
});

describe('resolveLayers', () => {
  it('resolves every layer, and treats missing layers as empty', () => {
    env.STATIC_BUILD = true;

    expect(resolveLayers([withStatic, live]).map((layer) => layer.url)).toEqual(['/maps/style.json', live.url]);
    expect(resolveLayers(undefined)).toEqual([]);
  });
});
