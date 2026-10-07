import { language_script_pairs as LANGUAGES, layers as basemapLayers, namedFlavor } from '@protomaps/basemaps';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export const BASEMAPS_VERSION = require('@protomaps/basemaps/package.json').version;

/**
 * Paths relative to the base URL.
 */
export const STYLE_PATH = 'style.json';
export const BASEMAP_PATH = 'basemap.pmtiles';

/**
 * The major version of the Protomaps tile data that @protomaps/basemaps draws.
 */
export const TILES_MAJOR_VERSION = 4;

const FLAVOR = 'light';

const DEFAULT_BASEMAP_MAXZOOM = 10;

// Degrees
const MIN_PADDING = 0.1;
const REGION_GRID = 0.5;
const MAX_LATITUDE = 85.0511;

export const normalizeBaseUrl = (baseUrl) => (baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);

/**
 * Returns the [west, south, east, north] bounds of the places' geometries, or null if none has one.
 */
export const getBounds = (places) => {
  let [minx, miny, maxx, maxy] = [Infinity, Infinity, -Infinity, -Infinity];

  const collect = (value) => {
    if (Array.isArray(value) && value.length >= 2 && typeof value[0] === 'number') {
      const [x, y] = value;

      minx = Math.min(minx, x);
      miny = Math.min(miny, y);
      maxx = Math.max(maxx, x);
      maxy = Math.max(maxy, y);
    } else if (Array.isArray(value)) {
      value.forEach(collect);
    } else if (value) {
      collect(value.coordinates);
      collect(value.geometries);
      collect(value.geometry);
      collect(value.features);
    }
  };

  for (const place of places || []) {
    collect(place?.place_geometry?.geometry_json);
  }

  return Number.isFinite(minx) ? [minx, miny, maxx, maxy] : null;
};

const clamp = ([minx, miny, maxx, maxy]) => [
  Math.max(-180, minx),
  Math.max(-MAX_LATITUDE, miny),
  Math.min(180, maxx),
  Math.min(MAX_LATITUDE, maxy)
];

/**
 * Pads the bounds by 25% of their size on each side, and at least 0.1 degrees, to give
 * the map a small amount of extra context.
 */
export const padBounds = ([minx, miny, maxx, maxy]) => {
  const padx = Math.max((maxx - minx) * 0.25, MIN_PADDING);
  const pady = Math.max((maxy - miny) * 0.25, MIN_PADDING);

  return clamp([minx - padx, miny - pady, maxx + padx, maxy + pady]);
};

/**
 * Snaps the bounds to a 0.5 degree grid, so the basemap region only changes when places
 * move outside of a grid line.
 */
export const snapBounds = ([minx, miny, maxx, maxy]) => {
  const steps = (n) => Number((n / REGION_GRID).toFixed(6));
  const down = (n) => Math.floor(steps(n)) * REGION_GRID;
  const up = (n) => Math.ceil(steps(n)) * REGION_GRID;

  return clamp([down(minx), down(miny), up(maxx), up(maxy)]);
};

const roundBounds = (bounds) => bounds.map((n) => Number(n.toFixed(2)));

/**
 * Returns the language to use for Protomaps.
 */
export const getLanguage = (locale) => {
  // Use the site's entire locale if supported
  const supported = LANGUAGES.map((pair) => pair.lang);
  if (supported.includes(locale)) {
    return locale;
  }
  // Otherwise just use the language portion; fallback to en
  const [language] = (locale || '').split('-');
  return supported.includes(language) ? language : 'en';
};

const validateBounds = (bbox, layer) => {
  if (!Array.isArray(bbox) || bbox.length !== 4 || !bbox.every((n) => typeof n === 'number')) {
    throw new Error(`Layer "${layer.name}": static.bbox must be four numbers: [west, south, east, north]`);
  }
};

/**
 * Returns what the generated files depend on: the basemap's region, zoom and language. Only layers whose `static.url`
 * is inside the base URL are included. Callers can hash the result to skip unchanged runs.
 */
export const getInputs = (config, places, { baseUrl }) => {
  const base = normalizeBaseUrl(baseUrl);

  let basemap = null;

  for (const layer of config?.layers || []) {
    if (!layer?.static?.url?.startsWith(base)) {
      continue;
    }

    const path = layer.static.url.substring(base.length);

    if (layer.static.bbox !== undefined) {
      validateBounds(layer.static.bbox, layer);
    }

    if (layer.layer_type === 'vector') {
      if (path !== STYLE_PATH) {
        throw new Error(`Layer "${layer.name}": a generated basemap's static.url must be ${base}${STYLE_PATH}`);
      }

      if (basemap) {
        continue;
      }

      let bbox = layer.static.bbox;

      if (!bbox) {
        const bounds = getBounds(places);

        if (!bounds) {
          throw new Error('No place has a geometry, so there is no region for the basemap. Pass --export-dir, or set static.bbox.');
        }

        bbox = snapBounds(padBounds(bounds));
      }

      basemap = {
        bbox: roundBounds(bbox),
        maxzoom: Number(layer.static.maxzoom ?? DEFAULT_BASEMAP_MAXZOOM),
        language: getLanguage(config?.i18n?.default_locale),
        flavor: FLAVOR,
        basemaps_version: BASEMAPS_VERSION
      };
    } else {
      throw new Error(`Layer "${layer.name}": ${layer.layer_type} layers can't be generated`);
    }
  }

  return {
    generator: 'maps',
    schema_version: 1,
    base_url: base,
    basemap
  };
};

/**
 * Returns the size in bytes from `pmtiles extract --dry-run` output, or null.
 */
export const getExtractSize = (output) => {
  const match = /archive size of ([\d.]+) ([kMGT]?)B\b/.exec(output || '');

  if (!match) {
    return null;
  }

  const multipliers = { '': 1, k: 1e3, M: 1e6, G: 1e9, T: 1e12 };
  return Math.round(Number(match[1]) * multipliers[match[2]]);
};

/**
 * Returns the basemap style, with all URLs based on the base URL, and fonts list.
 */
export const getStyle = (basemap, baseUrl) => {
  const style = {
    version: 8,
    glyphs: `${baseUrl}fonts/{fontstack}/{range}.pbf`,
    sprite: `${baseUrl}sprites/v4/${basemap.flavor}`,
    sources: {
      protomaps: {
        type: 'vector',
        url: `pmtiles://${baseUrl}${BASEMAP_PATH}`,
        attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
      }
    },
    layers: basemapLayers('protomaps', namedFlavor(basemap.flavor), { lang: basemap.language })
  };

  // Collect basemap style's fonts, which will need to be downloaded and stored
  const IS_FONT = /^[A-Z][\w ]+ (Regular|Medium|Bold|Italic|Light)$/;
  const fonts = new Set();

  const collect = (value) => {
    if (typeof value === 'string' && IS_FONT.test(value)) {
      fonts.add(value);
    } else if (Array.isArray(value)) {
      value.forEach(collect);
    }
  };

  for (const layer of style.layers) {
    collect(layer.layout?.['text-font']);
  }

  return { style, fonts: [...fonts].sort() };
};
