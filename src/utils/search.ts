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
 * Parses the "items" and "names" attributes for the "properties" key in the passed record.
 *
 * @param record
 */
export const parseFeature = (record) => ({
  ...record,
  properties: {
    ...record.properties || {},
    items: JSON.parse(record.properties?.items || '[]'),
    names: JSON.parse(record.properties?.names || '[]')
  }
});