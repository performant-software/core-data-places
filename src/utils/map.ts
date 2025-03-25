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