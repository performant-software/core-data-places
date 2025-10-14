import { Typesense as TypesenseUtils } from '@performant-software/core-data';
import _ from 'underscore';

const DEFAULT_JSON_FILENAME = 'search-results.json';
const MAX_ATTRIBUTES = 4;

/**
 * Adds a link to the document and downloads the passed file.
 *
 * @param file
 */
export const download = (file) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(file);

  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Exports the passed set of hits as a JSON file.
 *
 * @param hits
 * @param filename
 */
export const exportAsJSON = (hits, filename = DEFAULT_JSON_FILENAME) => {
  const file = new File([JSON.stringify(hits)], filename, { type: 'application/json' });

  download(file);
};

/**
 * Returns the attributes from the "result_card" prop.
 *
 * @param config
 */
export const getAttributes = (config) => config.result_card.attributes?.slice(0, MAX_ATTRIBUTES);

/**
 * Returns the facet label for the passed attribute.
 *
 * @param attribute
 * @param t
 * @param inverse
 */
export const getFacetLabel = (attribute, t, inverse = false, inverseSuffix = '_inverse') => {
  let value;
  
  // exclude these from facet labels, e.g. 'Organizations' rather than 'Organizations: Name'
  const DEFAULT_FIELDIDS = ["name", "names"]

  let relationshipId = TypesenseUtils.getRelationshipId(attribute);
  const fieldId = TypesenseUtils.getFieldId(attribute);

  if (inverse) {
    relationshipId = relationshipId + inverseSuffix;
  }

  if (relationshipId && fieldId && !DEFAULT_FIELDIDS.includes(fieldId)) {
    value = t('facetLabel', { relationship: t(relationshipId), field: t(fieldId) })
  } else if (relationshipId) {
    value = t(relationshipId);
  } else if (fieldId) {
    value = t(fieldId);
  }

  return value;
};

/**
 * Gets the label for a search column as given by the result_card.attributes config array.
 */
export const getColumnLabel = (flattenedAtt, t) => {
  // remove the indices from the path
  const path = flattenedAtt
    .split('.')
    .filter(att => !isNumber(att))
    .join('.');

  return getFacetLabel(path, t);
};

/**
 * Returns the value at the passed path for the passed hit.
 *
 * @param hit
 * @param path
 */
export const getHitValue = (hit, path) => _.get(hit, path.split('.'));

/**
 * Tests whether a string contains only integers.
 *
 * @param str
 */
const isNumber = (str: string) => /^\d+$/.test(str);

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
    let value = properties[key] = feature.properties[key];

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
