import fs from 'fs';
import { getAggregations, SORTINGS } from '../src/utils/staticSearchOptions.ts';

/**
 * Field IDs that `getFacetLabel` leaves out of a label, e.g. "Organizations" rather than
 * "Organizations: Name".
 */
const DEFAULT_FIELD_IDS = ['name', 'names'];

const FACET_SUFFIX = '_facet';

/**
 * Mirrors TypesenseUtils.getRelationshipId, e.g. "<uuid>.name" -> "<uuid>" and "title" -> "".
 */
const getRelationshipId = (attribute) => (attribute.includes('.')
  ? attribute.replace(FACET_SUFFIX, '').substring(0, attribute.indexOf('.'))
  : '');

/**
 * Mirrors TypesenseUtils.getFieldId, e.g. "<uuid>.name" -> "name" and "title" -> "title".
 */
const getFieldId = (attribute) => {
  const fieldId = attribute.replaceAll(FACET_SUFFIX, '');
  return fieldId.includes('.') ? fieldId.substring(fieldId.indexOf('.') + 1) : fieldId;
};

/**
 * Removes array indices from an attribute path, e.g. "<uuid>.0.name" -> "<uuid>.name", as the
 * search components do before looking up its label.
 */
const trimIndices = (attribute) => attribute
  .split('.')
  .filter((segment) => !/^\d+$/.test(segment))
  .join('.');

/**
 * Converts a key to a readable default label, e.g. "notes_general" -> "Notes General".
 */
const toTitle = (key) => key
  .split(/[._]/)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

/**
 * Mirrors `getSortingLabel` in `src/utils/staticSearch.ts`, e.g. "Title (A-Z)".
 */
const toSortTitle = ({ field, order }) => `${toTitle(field)} (${order === 'desc' ? 'Z-A' : 'A-Z'})`;

/**
 * Builds i18n entries for a static search, using the same keys the Typesense searches use: the
 * keys `getFacetLabel` looks up for its fields (the aggregations in its ItemsJS options,
 * `result_card.title` and `result_card.attributes`), and the ItemsJS sorting keys `getSortings`
 * looks up. Keys that already have a label, e.g. from `i18n.json`, a Core Data descriptor or
 * another index, are skipped so a generated title doesn't replace it.
 */
const buildStaticLabels = (search, existingKeys) => {
  const aggregations = getAggregations(search);
  const labels = {};

  const addLabel = (key, title = toTitle(key)) => {
    if (!key || existingKeys.has(key)) {
      return;
    }

    existingKeys.add(key);

    labels[key] = {
      tinaLabel: title,
      defaultValue: title
    };
  };

  const attributes = [
    ...Object.keys(aggregations),
    ...(search.result_card?.title ? [trimIndices(search.result_card.title)] : []),
    ...(search.result_card?.attributes || []).map(({ name }) => trimIndices(name))
  ];

  for (const attribute of attributes) {
    const relationshipId = getRelationshipId(attribute);
    const fieldId = getFieldId(attribute);

    if (!relationshipId) {
      addLabel(fieldId);
    } else if (DEFAULT_FIELD_IDS.includes(fieldId)) {
      addLabel(relationshipId);
    } else {
      // Labelled as "{{relationship}}: {{field}}"
      addLabel(relationshipId);
      addLabel(fieldId);
    }
  }

  for (const [name, sorting] of Object.entries(SORTINGS)) {
    addLabel(name, toSortTitle(sorting));
  }

  return labels;
};

/**
 * Pulls in the search indexes from `config.json`, plus the field labels for static indexes.
 *
 * @param config
 * @param userDefinedFields
 *
 * @returns {Promise<void>}
 */
export const buildSearch = async (config, userDefinedFields = {}) => {
  const searches = {};

  const i18n = JSON.parse(fs.readFileSync('./src/i18n/i18n.json', 'utf8'));
  const existingKeys = new Set([
    ...Object.keys(i18n),
    ...Object.keys(userDefinedFields),
    ...config.search.map(({ name }) => `index_${name}`)
  ]);

  for (const search of config.search) {
    searches[`index_${search.name}`] = {
      tinaLabel: `Search: ${search.name}`,
      defaultValue: search.name
    }

    if (search.static) {
      Object.assign(searches, buildStaticLabels(search, existingKeys));
    }
  }

  const content = JSON.stringify(searches, null, 2);
  fs.writeFileSync('./src/i18n/search.json', content, 'utf8');
};

/**
 * Checks that the searches match the kind of build: static builds only support `static` searches, and other builds
 * only support `typesense` searches. Also checks that each static search lists the project models to include, and that
 * each of them belongs to one of the projects in `core_data.project_ids`.
 *
 * @param config
 * @param descriptors
 * @param staticBuild whether STATIC_BUILD is true
 */
export const validateSearches = (config, descriptors, staticBuild) => {
  // Project models are the only descriptors without a context
  const modelIds = new Set(descriptors
    .filter((descriptor) => !descriptor.context)
    .map((descriptor) => descriptor.identifier));

  const errors = [];

  for (const search of config.search) {
    if (staticBuild && search.typesense) {
      errors.push(`Search "${search.name}" can't use "typesense" when STATIC_BUILD is true. Use "static" instead.`);
    }

    if (!staticBuild && search.static) {
      errors.push(`Search "${search.name}" can't use "static" unless STATIC_BUILD is true.`);
    }
  }

  for (const search of config.search.filter((search) => search.static)) {
    const searchModelIds = search.static.model_ids || [];

    if (!searchModelIds.length) {
      errors.push(`Static search "${search.name}" requires at least one "static.model_ids" entry.`);
    }

    for (const modelId of searchModelIds) {
      if (!modelIds.has(modelId)) {
        errors.push(
          `Static search "${search.name}" includes model "${modelId}", which is not in any of the projects in`
          + ` "core_data.project_ids" (${config.core_data.project_ids.join(', ')}).`
        );
      }
    }
  }

  if (errors.length) {
    throw new Error(errors.join('\n'));
  }
};
