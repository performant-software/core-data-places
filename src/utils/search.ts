import { Typesense as TypesenseUtils } from '@performant-software/core-data';

const DEFAULT_JSON_FILENAME = 'search-results.json';

/**
 * Adds a link to the document and downloads the passed file.
 *
 * @param file
 */
export const download = (file) => {
  const link = document.createElement('a')
  const url = URL.createObjectURL(file)

  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

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

/**
 * Given a flattened attribute name, e.g. myobj.hits.0.name,
 * extracts the value from the passed hit.
 */
export const renderFlattenedAttribute = (hit, flattenedAtt) => {
  const path = flattenedAtt.split('.');

  let val = hit;

  for (const pathItem of path) {
    if (!val) {
      return val;
    }

    if (isNumber(pathItem)) {
      val = val[parseInt(pathItem)];
    } else {
      val = val[pathItem];
    }
  }

  return val;
};
