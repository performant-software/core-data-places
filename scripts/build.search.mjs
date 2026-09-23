import fs from 'fs';
import path from 'node:path';
import { contentPath } from './build.paths.mjs';

const PUBLIC_SEARCH_DIR = './public/search';

/**
 * Suffix used for the ItemsJS configuration file that accompanies each data file.
 */
const CONFIG_SUFFIX = '.itemsjs.json';

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
  const source = contentPath('search', `${search.static.index_name}${CONFIG_SUFFIX}`);

  // buildStaticSearch reports the missing file
  const { aggregations = {}, sortings = {} } = fs.existsSync(source)
    ? JSON.parse(fs.readFileSync(source, 'utf8'))
    : {};

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
    const title = aggregations[attribute]?.title;
    const relationshipId = getRelationshipId(attribute);
    const fieldId = getFieldId(attribute);

    if (!relationshipId) {
      addLabel(fieldId, title);
    } else if (DEFAULT_FIELD_IDS.includes(fieldId)) {
      addLabel(relationshipId, title);
    } else {
      // Labelled as "{{relationship}}: {{field}}", so the aggregation title doesn't apply
      addLabel(relationshipId);
      addLabel(fieldId);
    }
  }

  for (const [name, sorting] of Object.entries(sortings)) {
    addLabel(name, sorting.title || toSortTitle(sorting));
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

export const buildStaticSearch = async (config) => {
  const indexNames = config.search
    .filter((search) => search.static)
    .map((search) => search.static.index_name);

  if (!indexNames.length) {
    return;
  }

  if (!fs.existsSync(contentPath())) {
    console.warn(`Skipping static search indexes; ${contentPath()} does not exist`);
    return;
  }

  fs.mkdirSync(PUBLIC_SEARCH_DIR, { recursive: true });

  for (const indexName of indexNames) {
    for (const filename of [`${indexName}.json`, `${indexName}${CONFIG_SUFFIX}`]) {
      const source = contentPath('search', filename);

      if (!fs.existsSync(source)) {
        throw new Error(
          `Missing static search file "${source}". Each "static.index_name" in config.json`
          + ` requires both <index_name>.json and <index_name>${CONFIG_SUFFIX} in /content/search.`
        );
      }

      fs.cpSync(source, path.join(PUBLIC_SEARCH_DIR, filename));
      console.info(`Copying ${source}`);
    }
  }
};
