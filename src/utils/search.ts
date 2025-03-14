import { Typesense as TypesenseUtils } from '@performant-software/core-data';

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
export const getAttributes = (config) => config.search.result_card.attributes?.slice(0, MAX_ATTRIBUTES);

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
 * Tests whether a string contains only integers.
 *
 * @param str
 */
const isNumber = (str: string) => /^\d+$/.test(str);
