import ClearRefinementsButton from '@apps/search/ClearRefinementsButton';
import CurrentRefinementsList from '@apps/search/CurrentRefinementsList';
import GeosearchFilter from '@apps/search/GeosearchFilter';
import ListFacet from '@apps/search/ListFacet';
import RangeFacet from '@apps/search/RangeFacet';
import TranslationContext from '@apps/search/TranslationContext';
import { FacetStateContext } from '@performant-software/core-data';
import clsx from 'clsx';
import { useContext } from 'react';
import _ from 'underscore';

interface Props {
  className?: string;
}

const Facets = (props: Props) => {
  const { attributes, rangeAttributes } = useContext(FacetStateContext);
  const { t } = useContext(TranslationContext);

  return (
    <aside
      className={clsx(
        'flex',
        'flex-col',
        'flex-grow',
        'h-full',
        'px-6',
        'bg-neutral-100',
        'backdrop-blur',
        'shadow',
        'overflow-y-auto',
        props.className
      )}
    >
      <div
        className='flex justify-between items-center'
      >
        <h2
          className='py-4 font-semibold text-lg'
        >
          { t('filters') }
        </h2>
        <ClearRefinementsButton />
      </div>
      <CurrentRefinementsList />
      <GeosearchFilter />
      { _.map(rangeAttributes, (attribute, index) => (
        <RangeFacet
          attribute={attribute}
          className={clsx({
          'border-b border-neutral-200': index < attribute.length - 1
          })}
        />
      ))}
      { _.map(attributes, (attribute, index) => (
        <ListFacet
          attribute={attribute}
          className={clsx({
            'border-b border-neutral-200': index < attribute.length - 1
          })}
        />
      ))}
    </aside>
  );
};

export default Facets;