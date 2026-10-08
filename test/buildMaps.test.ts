import { describe, expect, it } from 'vitest';
import {
  BASEMAPS_VERSION,
  getBounds,
  getExtractSize,
  getInputs,
  getLanguage,
  getStyle,
  getTileRange,
  getTiles,
  padBounds,
  snapBounds
} from '../scripts/maps/inputs.mjs';

const BASE_URL = '/_fds/maps/';

const toPlace = (geometry: object | null) => ({ place_geometry: { geometry_json: geometry } });

const places = [
  toPlace({ type: 'GeometryCollection', geometries: [{ type: 'Point', coordinates: [-71.12, 42.34] }] }),
  toPlace({ type: 'Polygon', coordinates: [[[-71.2, 42.3], [-71.0, 42.3], [-71.0, 42.4], [-71.2, 42.3]]] }),
  toPlace(null),
  {}
];

const basemapLayer = {
  name: 'Basemap',
  layer_type: 'vector',
  url: 'https://api.maptiler.com/maps/dataviz/style.json?key=abc',
  static: { url: '/_fds/maps/style.json' }
};

const rasterLayer = {
  name: 'Historic map',
  layer_type: 'raster',
  url: 'https://tiles.example.org/historic/{z}/{x}/{y}.png',
  overlay: true,
  static: { url: '/_fds/maps/overlays/historic/{z}/{x}/{y}.png', maxzoom: 6 }
};

const geojsonLayer = {
  name: 'Boundaries',
  layer_type: 'geojson',
  url: 'https://data.example.org/boundaries.geojson',
  overlay: true,
  static: { url: '/_fds/maps/overlays/boundaries.geojson' }
};

const toConfig = (layers: object[], locale = 'en') => ({ i18n: { default_locale: locale }, layers });

describe('getBounds', () => {
  it('covers every coordinate of every geometry type', () => {
    expect(getBounds(places)).toEqual([-71.2, 42.3, -71.0, 42.4]);
  });

  it('is null when no place has a geometry', () => {
    expect(getBounds([toPlace(null), {}])).toBeNull();
    expect(getBounds(undefined)).toBeNull();
  });
});

describe('padBounds', () => {
  it('adds a quarter of the size on each side', () => {
    const [minx, miny, maxx, maxy] = padBounds([0, 0, 4, 8]);
    expect([minx, miny, maxx, maxy]).toEqual([-1, -2, 5, 10]);
  });

  it('pads clustered places by at least 0.1 degrees', () => {
    expect(padBounds([10, 20, 10, 20])).toEqual([9.9, 19.9, 10.1, 20.1]);
  });

  it('stays within the world a web map can show', () => {
    expect(padBounds([-179, -84, 179, 84])).toEqual([-180, -85.0511, 180, 85.0511]);
  });
});

describe('snapBounds', () => {
  it('widens the region to the 0.5 degree grid', () => {
    expect(snapBounds([-71.3, 42.2, -70.9, 42.45])).toEqual([-71.5, 42, -70.5, 42.5]);
  });

  it('keeps edges already on the grid, despite floating point noise', () => {
    expect(snapBounds([-71.5, 42, -70.5, 42.4 + 0.1])).toEqual([-71.5, 42, -70.5, 42.5]);
  });

  it('stays within the world a web map can show', () => {
    expect(snapBounds([-179.9, -85.0511, 179.9, 85.0511])).toEqual([-180, -85.0511, 180, 85.0511]);
  });
});

describe('getLanguage', () => {
  it('uses supported locales, falling back to the language and then English', () => {
    expect(getLanguage('fr')).toBe('fr');
    expect(getLanguage('pt-BR')).toBe('pt');
    expect(getLanguage('xx')).toBe('en');
    expect(getLanguage(undefined)).toBe('en');
  });
});

describe('getInputs', () => {
  it('describes the basemap from the places and the site config', () => {
    const inputs = getInputs(toConfig([basemapLayer], 'fr'), places, { baseUrl: BASE_URL });

    expect(inputs).toEqual({
      generator: 'maps',
      schema_version: 1,
      base_url: BASE_URL,
      basemap: {
        bbox: [-71.5, 42, -70.5, 42.5],
        maxzoom: 10,
        language: 'fr',
        flavor: 'light',
        basemaps_version: BASEMAPS_VERSION
      },
      overlays: []
    });
  });

  it('keeps the same region when places are added nearby', () => {
    const config = toConfig([basemapLayer]);
    const nearby = toPlace({ type: 'Point', coordinates: [-71.05, 42.38] });
    const further = toPlace({ type: 'Point', coordinates: [-70.3, 42.38] });

    const { basemap } = getInputs(config, places, { baseUrl: BASE_URL });

    expect(getInputs(config, [...places, nearby], { baseUrl: BASE_URL }).basemap).toEqual(basemap);
    expect(getInputs(config, [...places, further], { baseUrl: BASE_URL }).basemap).toMatchObject({ bbox: [-71.5, 42, -70, 42.5] });
  });

  it('uses the layer\'s maxzoom and bbox when set', () => {
    const layer = { ...basemapLayer, static: { ...basemapLayer.static, maxzoom: 12, bbox: [1.234, 2.345, 3.456, 4.567] } };
    const { basemap } = getInputs(toConfig([layer]), [], { baseUrl: BASE_URL });

    expect(basemap).toMatchObject({ maxzoom: 12, bbox: [1.23, 2.35, 3.46, 4.57] });
  });

  it('describes raster and GeoJSON overlays, sorted by path', () => {
    const { overlays } = getInputs(toConfig([basemapLayer, rasterLayer, geojsonLayer]), places, { baseUrl: BASE_URL });

    expect(overlays).toEqual([{
      name: 'Boundaries',
      type: 'geojson',
      source: geojsonLayer.url,
      path: 'overlays/boundaries.geojson'
    }, {
      name: 'Historic map',
      type: 'raster',
      source: rasterLayer.url,
      path: 'overlays/historic/{z}/{x}/{y}.png',
      maxzoom: 6
    }]);
  });

  it('ignores layers that are live or hosted elsewhere', () => {
    const live = { ...basemapLayer, static: undefined };
    const elsewhere = { ...rasterLayer, static: { url: 'https://tiles.example.org/static/{z}/{x}/{y}.png' } };

    expect(getInputs(toConfig([live, elsewhere]), places, { baseUrl: BASE_URL })).toMatchObject({
      basemap: null,
      overlays: []
    });
  });

  it('accepts a base URL without a trailing slash', () => {
    expect(getInputs(toConfig([basemapLayer]), places, { baseUrl: '/_fds/maps' }).base_url).toBe(BASE_URL);
  });

  it('only generates one basemap when several layers use the style', () => {
    const { basemap } = getInputs(toConfig([basemapLayer, { ...basemapLayer, name: 'Copy' }]), places, { baseUrl: BASE_URL });
    expect(basemap).not.toBeNull();
  });

  it('rejects layers it can\'t generate', () => {
    const generate = (layer: object) => () => getInputs(toConfig([basemapLayer, layer]), places, { baseUrl: BASE_URL });

    expect(generate({ ...basemapLayer, static: { url: '/_fds/maps/other.json' } })).toThrow('static.url must be /_fds/maps/style.json');
    expect(generate({ ...rasterLayer, static: { url: '/_fds/maps/historic/{z}/{x}/{y}.png' } })).toThrow('tile template in /_fds/maps/overlays/');
    expect(generate({ ...rasterLayer, url: 'https://example.org/wms?bbox={bbox-epsg-3857}' })).toThrow('only {z}/{x}/{y} tile URLs');
    expect(generate({ ...geojsonLayer, static: { url: '/_fds/maps/boundaries.geojson' } })).toThrow('must be in /_fds/maps/overlays/');
    expect(generate({ ...rasterLayer, static: { ...rasterLayer.static, bbox: [1, 2, 3] } })).toThrow('four numbers');
    expect(generate({ name: 'Warped', layer_type: 'georeference', url: 'https://annotations.allmaps.org/x', static: { url: '/_fds/maps/overlays/warped.json' } }))
      .toThrow('georeference layers can\'t be generated');
  });

  it('needs a region for the basemap', () => {
    expect(() => getInputs(toConfig([basemapLayer]), [toPlace(null)], { baseUrl: BASE_URL })).toThrow('no region');
  });

  it('needs a region for raster overlays when there is no basemap', () => {
    expect(() => getInputs(toConfig([rasterLayer]), places, { baseUrl: BASE_URL })).toThrow('set static.bbox');
    expect(getInputs(toConfig([{ ...rasterLayer, static: { ...rasterLayer.static, bbox: [0, 0, 1, 1] } }]), [], { baseUrl: BASE_URL }).overlays).toHaveLength(1);
  });

  it('gives the same inputs for the same config and places', () => {
    const config = toConfig([basemapLayer, rasterLayer, geojsonLayer]);

    expect(JSON.stringify(getInputs(config, places, { baseUrl: BASE_URL })))
      .toBe(JSON.stringify(getInputs(structuredClone(config), [...places].reverse(), { baseUrl: BASE_URL })));
  });
});

describe('getTiles', () => {
  it('covers the world with one tile at zoom 0 and four at zoom 1', () => {
    expect(getTiles([-180, -85, 180, 85], 0)).toEqual([{ z: 0, x: 0, y: 0 }]);
    expect(getTiles([-180, -85, 180, 85], 1)).toHaveLength(4);
  });

  it('covers a small area with the tiles it overlaps', () => {
    expect(getTiles([-71.1, 42.35, -71.05, 42.36], 10)).toEqual([{ z: 10, x: 309, y: 378 }]);
    expect(getTiles([-71.2, 42.3, -71.0, 42.4], 10)).toEqual([{ z: 10, x: 309, y: 378 }, { z: 10, x: 310, y: 378 }]);
  });

  it('counts tiles for every zoom up to the maximum', () => {
    expect(getTileRange([-180, -85, 180, 85], 2)).toHaveLength(1 + 4 + 16);
  });
});

describe('getStyle', () => {
  const basemap = { bbox: [0, 0, 1, 1], maxzoom: 10, language: 'fr', flavor: 'light' };

  it('points every URL inside the base URL', () => {
    const { style } = getStyle(basemap, BASE_URL);

    expect(style.glyphs).toBe('/_fds/maps/fonts/{fontstack}/{range}.pbf');
    expect(style.sprite).toBe('/_fds/maps/sprites/v4/light');
    expect(style.sources.protomaps.url).toBe('pmtiles:///_fds/maps/basemap.pmtiles');
    expect(style.sources.protomaps.attribution).toContain('OpenStreetMap');
  });

  it('labels the map in the basemap\'s language', () => {
    const { style } = getStyle(basemap, BASE_URL);
    expect(JSON.stringify(style.layers)).toContain('name:fr');
  });

  it('lists the font stacks the style uses', () => {
    const { fonts } = getStyle(basemap, BASE_URL);

    expect(fonts.length).toBeGreaterThan(0);
    expect(fonts.every((font) => /^Noto Sans /.test(font))).toBe(true);
  });
});

describe('getExtractSize', () => {
  it('reads the size pmtiles reports, in bytes', () => {
    expect(getExtractSize('extract.go:612: Extract transferred 10 MB (overfetch 0.05) for an archive size of 9.5 MB')).toBe(9500000);
    expect(getExtractSize('for an archive size of 1.2 GB')).toBe(1200000000);
    expect(getExtractSize('for an archive size of 640 kB')).toBe(640000);
    expect(getExtractSize('for an archive size of 900 B')).toBe(900);
  });

  it('is null when the output has no size', () => {
    expect(getExtractSize('something else')).toBeNull();
    expect(getExtractSize(undefined)).toBeNull();
  });
});
