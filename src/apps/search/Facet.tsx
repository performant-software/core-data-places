import TranslationContext from '@apps/search/TranslationContext';
import { getFacetLabel } from '@utils/search';
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
  const label = useMemo(() => getFacetLabel(attribute, t), [attribute, t]);

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
