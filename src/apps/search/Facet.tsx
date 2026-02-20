import TranslationContext from '@contexts/TranslationContext';
import { Icon } from '@performant-software/core-data';
import { getFacetLabel, isInverse } from '@utils/search';
import clsx from 'clsx';
import { useContext, useMemo, type ReactNode } from 'react';
import { useHits } from 'react-instantsearch';

interface Props {
  attribute: string;
  children: ReactNode,
  className?: string;
  icon?: string;
}

const Facet = ({ attribute, children, className, icon }: Props) => {
  const { t } = useContext(TranslationContext);

  const { items } = useHits();

  const label = useMemo(() => getFacetLabel(attribute, t, isInverse(attribute, items)), [attribute, items.length, t]);

  return (
    <div
      className={clsx(
        'text-sm',
        'py-3',
        'border-b border-neutral-200',
        className
      )}
    >
      <p
        className='py-3 font-semibold flex items-center gap-1 uppercase'
      >
        { icon && (
          <Icon
            name={icon}
            size={24}
          />
        ) }
        { label }
      </p>
      { children }
    </div>
  );
};

export default Facet;
