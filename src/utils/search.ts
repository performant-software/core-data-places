import { Typesense as TypesenseUtils } from '@performant-software/core-data';

/**
 * Returns the facet label for the passed attribute.
 *
 * @param attribute
 * @param t
 */
export const getFacetLabel = (attribute, t) => {
  let value;

  const relationshipId = TypesenseUtils.getRelationshipId(attribute);
  const fieldId = TypesenseUtils.getFieldId(attribute);

  if (relationshipId && fieldId) {
    value = t('facetLabel', { relationship: t(relationshipId), field: t(fieldId) })
  } else if (fieldId) {
    value = t(fieldId);
  }

  return value;
};

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
    if (typeof feature.properties[key] === 'string') {
      try {
        properties[key] = JSON.parse(feature.properties[key] as string);
      } catch (e) {
        properties[key] = feature.properties[key];
      }
    }
  }

  return {
    ...feature,
    properties
  };
}