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
 * Tests whether a string contains only integers.
 */
const isNumber = (str: string) => /^\d+$/.test(str)

/**
 * Gets the label for a search column as given by the result_card.attributes config array.
 */
export const getColumnLabel = (flattenedAtt, t) => {
  // remove the indices from the path
  const path = flattenedAtt
    .split('.')
    .filter(att => !isNumber(att))
    .join('.')
  
  return getFacetLabel(path, t)
}

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
}
