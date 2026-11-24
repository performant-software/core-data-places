import { Typesense as TypesenseUtils } from '@performant-software/core-data';
import { FuzzyDate as FuzzyDateUtils } from '@performant-software/shared-components';
import userDefinedFields from '@i18n/userDefinedFields.json';
import _ from 'underscore';

const DEFAULT_JSON_FILENAME = 'search-results.json';
const MAX_ATTRIBUTES = 4;
export const INVERSE_SUFFIX = '_inverse';
const ALWAYS_INCLUDE_ATTRIBUTES = ['name', 'id', 'uuid', 'record_id', 'thumbnail'];
const MAP_FEATURE_ATTRIBUTES = ['name', 'names', 'uuid', 'record_id', 'type'];
const RELATED_RECORD_ATTRIBUTES = ['name', 'uuid', 'inverse'];

// for timeline events, we only actually use these fields: `id`/`uuid` for navigation and de-duping
// (see TimelineView/buildStackedTimelineData), and `name`/`start_date`/`end_date` for rendering
// (see FacetTimeline/buildTimelineData)
const EVENT_ATTRIBUTES = ['id', 'uuid', 'name', 'start_date', 'end_date'];

// every relationship id that has a generated "<id>_inverse" translation, i.e. every relationship
// configured in Core Data. Used as a fallback below when facets are discovered dynamically from
// the Typesense schema rather than from an explicit `typesense.facets.include` allowlist.
const ALL_RELATIONSHIP_IDS = Object.keys(userDefinedFields)
  .filter((key) => key.endsWith(INVERSE_SUFFIX))
  .map((key) => key.slice(0, -INVERSE_SUFFIX.length));

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
 * Removes array indices from the passed attribute path, e.g. "<uuid>.0.name" becomes "<uuid>.name".
 *
 * @param path
 */
export const removeArrayIndices = (path: string) => path
  .split('.')
  .filter((segment) => !isNumber(segment))
  .join('.');

/**
 * Returns the relationship ids (e.g. the "<uuid>" in "<uuid>.name_facet") whose "inverse" flag is
 * needed to pick the correct facet label direction (see getFacetLabel/isInverse below).
 *
 * @param config
 */
const getFacetRelationshipIds = (config) => {
  const include = config.typesense?.facets?.include;
  const exclude = config.typesense?.facets?.exclude || [];

  // an explicit allowlist tells us exactly which relationships can be faceted
  if (!_.isEmpty(include)) {
    return _.uniq(_.compact(include.map((facet: string) => TypesenseUtils.getRelationshipId(facet))));
  }

  // without an allowlist, facets are discovered dynamically from the full Typesense schema (see
  // FacetStateContextProvider), so we can't know in advance which relationships will be faceted.
  // fall back to every configured relationship, minus any explicitly excluded facets.
  return _.difference(ALL_RELATIONSHIP_IDS, exclude.map((facet: string) => TypesenseUtils.getRelationshipId(facet)));
};

/**
 * Returns the hit attributes needed to render the timeline (both the map search's live timeline
 * and the saved timeline/stacked-timeline visualization embeds). Mirrors the narrowing already
 * done for relationships: when Event isn't the primary model, `timeline.event_path` points to a
 * relationship, so we only request its `EVENT_ATTRIBUTES` rather than the full related record.
 *
 * @param config
 */
const getTimelineAttributes = (config) => {
  if (!config.timeline) {
    return [];
  }

  if (config.timeline.event_path) {
    return EVENT_ATTRIBUTES.map((attr) => `${config.timeline.event_path}.${attr}`);
  }

  // Event is the primary model, so id/uuid/name are already in ALWAYS_INCLUDE_ATTRIBUTES
  return ['start_date', 'end_date'];
};

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
      ...(_.map(RELATED_RECORD_ATTRIBUTES, (attr: string) => (
        `${r}.${attr}`
      )))
    ]
  }

  // when the geometry lives on a related record, map features are built from that record's fields
  const geometryPath: string = config.map?.geometry || '';
  const geometryObjectPath = geometryPath.substring(0, geometryPath.lastIndexOf('.'));
  const mapFeatureAttributes = geometryObjectPath
    ? MAP_FEATURE_ATTRIBUTES.map((attr) => `${geometryObjectPath}.${attr}`)
    : [];

  const tagNames = _.map((config.result_card?.tags || []), (tag: any) => removeArrayIndices(tag.name));

  // relationship-prefixed result_card attributes (e.g. "<uuid>.field_name") need their
  // relationship's "inverse" flag too, for the same reason as facets above
  const attributeRelationshipIds = _.uniq(_.compact(
    getAttributes(config).map((att: any) => TypesenseUtils.getRelationshipId(removeArrayIndices(att.name)))
  ));

  const inverseAttributes = _.uniq([
    ...getFacetRelationshipIds(config),
    ...attributeRelationshipIds
  ]).map((id) => `${id}.inverse`);

  return (_.uniq(_.compact([
    ...ALWAYS_INCLUDE_ATTRIBUTES,
    config.result_card?.title && removeArrayIndices(config.result_card.title),
    config.map?.geometry,
    config.map?.properties,
    // TypesenseUtils.getFeatures always picks "names" off the primary hit for every map feature's
    // item metadata, regardless of whether the geometry itself lives on a related record
    config.map && 'names',
    ...mapFeatureAttributes,
    ...getTimelineAttributes(config),
    ...relationships, 
    ...inverseAttributes,
    ...tagNames, 
    ...getAttributes(config).map((att: any) => removeArrayIndices(att.name))
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
  return getFacetLabel(removeArrayIndices(flattenedAtt), t);
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
