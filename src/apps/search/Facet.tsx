import TranslationContext from '@contexts/TranslationContext';
import { Icon, useCachedHits } from '@performant-software/core-data';
import { getFacetLabel } from '@utils/search';
import clsx from 'clsx';
import { useContext, useMemo, type ReactNode } from 'react';
import _ from 'underscore';

interface Props {
  attribute: string;
  children: ReactNode,
  className?: string;
  icon?: string;
  inverse?: boolean;
}

const Facet = ({ attribute, children, className, icon }: Props) => {
  const { t } = useContext(TranslationContext);

  //this is very janky but we need some way to determine whether to use the inverse label or not,
  //and the easiest place to access that information seems to be by looking at the value of
  //the attribute in a hit where it's defined

  const hits = useCachedHits();

  const attribute_base = useMemo(() => attribute.split('.')[0], [attribute]);

  const sample_hit = useMemo(() => _.find(hits, (hit) => 
    (hit && 
      hit[attribute_base] && 
      Array.isArray(hit[attribute_base]) && 
      typeof hit[attribute_base][0] === 'object')
    ), [hits, attribute_base]);

  const inverse = useMemo(() => sample_hit && sample_hit[attribute_base][0]["inverse"], [sample_hit]);

  /**
   * Memo-izes the label for the current facet.
   */
  const label = useMemo(() => getFacetLabel(attribute, t, inverse), [attribute, t, inverse]);

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
