import type { Configuration } from '@types';
import { STATIC_BUILD } from 'astro:env/client';
import _ from 'underscore';

type Layer = NonNullable<Configuration['layers']>[number];

/**
 * Returns the passed map layer, using its `static.url` in place of its `url` for static builds. The `url` itself is
 * left in the config so that references to the layer (e.g. a path's overlay) still match.
 *
 * @param layer
 */
export const resolveLayer = (layer: Layer): Layer => (
  STATIC_BUILD && layer?.static?.url
    ? { ...layer, url: layer.static.url }
    : layer
);

/**
 * Returns the passed map layers with `resolveLayer` applied to each.
 *
 * @param layers
 */
export const resolveLayers = (layers?: Layer[]): Layer[] => _.map(layers || [], resolveLayer);

/**
 * Parses the JSON from the `properties` object as a work-around. See description below.
 *
 * @param feature
 */
export const parseFeature = (feature) => {
  if (!feature) {
    return null;
  }

  let properties = {};

  /**
   * This looks to be a known issue with `maplibre-gl-js`. The `properties` object is serialized into a string. As a
   * work-around, we'll check all of the keys and attempt to parse all of the strings into JSON.
   *
   * @see https://github.com/maplibre/maplibre-gl-js/issues/1325
   */
  for (const key in feature.properties) {
    let value = feature.properties[key];

    if (typeof feature.properties[key] === 'string') {
      try {
        value = JSON.parse(feature.properties[key] as string);
      } catch (e) {
        value = feature.properties[key];
      }
    }

    properties[key] = value;
  }

  return {
    ...feature,
    properties
  };
};

export const kilometersToMiles = (km) => km * 0.621371;

const DEFAULT_GEO_LOCATION_FIELD = 'coordinates';

/**
 * Returns the search field the "filter by map bounds" option reads locations from. When the map geometry comes from
 * a related record, e.g. "<relationship-uuid>.place_geometry", the locations are in that relationship's coordinates,
 * e.g. "<relationship-uuid>.coordinates".
 *
 * @param config
 */
export const getGeoLocationField = (config: { map?: { geometry?: string } }) => {
  const path = config.map?.geometry || '';
  const index = path.lastIndexOf('.');

  return index < 0 ? DEFAULT_GEO_LOCATION_FIELD : `${path.substring(0, index)}.${DEFAULT_GEO_LOCATION_FIELD}`;
};
