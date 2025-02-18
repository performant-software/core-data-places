import TranslationContext from '@apps/search/TranslationContext';
import { Typesense as TypesenseUtils } from '@performant-software/core-data';
import clsx from 'clsx';
import { useContext, useMemo, type ReactNode } from 'react';

interface Props {
  attribute: string;
  children: ReactNode,
  className?: string;
}

const Facet = ({ attribute, children, className }: Props) => {
  const { t } = useContext(TranslationContext);

  /**
   * Memo-izes the label for the current facet.
   */
  const label = useMemo(() => {
    let value;

    const relationshipId = TypesenseUtils.getRelationshipId(attribute);
    const fieldId = TypesenseUtils.getFieldId(attribute);

    if (relationshipId && fieldId) {
      value = t('facetLabel', { relationship: t(relationshipId), field: t(fieldId) })
    } else if (fieldId) {
      value = t(fieldId);
    }

    return value;
  }, [attribute, t]);

  return (
    <div
      className={clsx('text-sm', 'py-3', className)}
    >
      <h2
        className='py-3 font-semibold'
      >
        { label }
      </h2>
      { children }
    </div>
  );
};

export default Facet;
