import { Typesense as TypesenseUtils } from '@performant-software/core-data';
import { FuzzyDate as FuzzyDateUtils } from '@performant-software/shared-components';
import _ from 'underscore';

const DEFAULT_JSON_FILENAME = 'search-results.json';
const MAX_ATTRIBUTES = 4;
export const INVERSE_SUFFIX = '_inverse';
const ALWAYS_INCLUDE_ATTRIBUTES = ['name', 'id', 'uuid', 'record_id', 'thumbnail'];
const MAP_FEATURE_ATTRIBUTES = ['name', 'names', 'uuid', 'record_id', 'type'];

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
 * Returns the attributes from the 'result_card' prop.
 *
 * @param config
 */
export const getAttributes = (config) => config.result_card.attributes?.slice(0, MAX_ATTRIBUTES) || [];

/**
 * Returns a single array of all hit attributes needed to render the results list
 * 
 * @param config
 */
export const getDisplayAttributes = (config) => {
  // for relationships, we only actually use the name, UUID, and inverse flag
  let relationships: string[] = [];
  for (const r of (config?.result_card.relationships || [])) {
    relationships = [
      ...relationships,
      `${r}.name`,
      `${r}.uuid`,
      `${r}.inverse`
    ]
  }

  // when the geometry lives on a related record, map features are built from that record's fields
  const geometryPath: string = config.map?.geometry || '';
  const geometryObjectPath = geometryPath.substring(0, geometryPath.lastIndexOf('.'));
  const mapFeatureAttributes = geometryObjectPath
    ? MAP_FEATURE_ATTRIBUTES.map((attr) => `${geometryObjectPath}.${attr}`)
    : [];

  return (_.uniq(_.compact([
    ...ALWAYS_INCLUDE_ATTRIBUTES,
    config.map?.geometry,
    config.map?.properties,
    ...mapFeatureAttributes,
    config.timeline?.event_path,
    ...relationships, 
    ...(config.result_card.tags || []), 
    ...getAttributes(config).map((att: any) => (att.name))
  ])))
};

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
  const DEFAULT_FIELD_IDS = ['name', 'names'];

  let relationshipId = TypesenseUtils.getRelationshipId(attribute);
  const fieldId = TypesenseUtils.getFieldId(attribute);

  if (relationshipId && inverse) {
    relationshipId = relationshipId + inverseSuffix;
  }

  if (relationshipId && fieldId && !DEFAULT_FIELD_IDS.includes(fieldId)) {
    value = t('facetLabel', { relationship: t(relationshipId), field: t(fieldId) })
  } else if (relationshipId) {
    value = t(relationshipId);
  } else if (fieldId) {
    value = t(fieldId);
  }

  return value;
};

/**
 * Get the label for a relationship UUID.
 * This is NOT meant for fields (e.g. '<uuid>.name'), only for top-level relationships.
 */
export const getRelationshipLabel = (uuid: string, t: any, inverse = false) => {
  let value = uuid;

  if (inverse) {
    value = `${uuid}${INVERSE_SUFFIX}`;
  }

  return t(value);
};

export const isInverse = (attribute: string, hits: any[]) => {
  if (hits.length === 0) {
    return false;
  }

  const attributeBase = attribute.split('.')[0];

  const sampleHit = _.find(hits, (hit) => (
      hit &&
      hit[attributeBase] &&
      Array.isArray(hit[attributeBase]) &&
      typeof hit[attributeBase][0] === 'object'
  ));

  return sampleHit && sampleHit[attributeBase][0]['inverse'];
}

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
 * @param fuzzyDate
 */
export const getHitValue = (hit, attr) => {
  const { name, parser } = attr;
  const rawValue = _.get(hit, name.split('.'));
  switch (parser) {
    case 'fuzzyDate':
      return FuzzyDateUtils.getDateView(rawValue);
    default:
      return rawValue;
  }
};

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
