import TranslationContext from '@contexts/TranslationContext';
import { Icon } from '@performant-software/core-data';
import { getFacetLabel, isInverse } from '@utils/search';
import clsx from 'clsx';
import { useContext, type ReactNode, useState, useEffect } from 'react';
import { useHits } from 'react-instantsearch';

interface Props {
  attribute: string;
  children: ReactNode,
  className?: string;
  icon?: string;
}

const Facet = ({attribute, children, className, icon}: Props) => {
  const { t } = useContext(TranslationContext);
  const [label, setLabel] = useState(getFacetLabel(attribute, t));

  const { items } = useHits();

  useEffect(() => {
    if (items.length > 0) {
      setLabel(getFacetLabel(attribute, t, isInverse(attribute, items)))
    }
  }, [items.length]);

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
        ) }
        { label }
      </h2>
      { children }
    </div>
  );
};

export default Facet;
