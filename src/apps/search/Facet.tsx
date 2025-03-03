import TranslationContext from '@apps/search/TranslationContext';
import { Icon } from '@performant-software/core-data';
import { getFacetLabel } from '@utils/search';
import clsx from 'clsx';
import { useContext, useMemo, type ReactNode } from 'react';

interface Props {
  attribute: string;
  children: ReactNode,
  className?: string;
  icon?: string;
}

const Facet = ({ attribute, children, className, icon }: Props) => {
  const { t } = useContext(TranslationContext);

  /**
   * Memo-izes the label for the current facet.
   */
  const label = useMemo(() => getFacetLabel(attribute, t), [attribute, t]);

  return (
    <div
      className={clsx(
        'text-sm',
        'py-3',
        'border-b border-neutral-200',
        className
      )}
    >
      <h2
        className='py-3 font-semibold flex items-center gap-1'
      >
        { icon && (
          <Icon
            name={icon}
            size={24}
          />
        )}
        { label }
      </h2>
      { children }
    </div>
  );
};

export default Facet;
