import ClearRefinementsButton from '@apps/search/ClearRefinementsButton';
import CurrentRefinementsList from '@apps/search/CurrentRefinementsList';
import GeosearchFilter from '@apps/search/GeosearchFilter';
import ListFacet from '@apps/search/ListFacet';
import RangeFacet from '@apps/search/RangeFacet';
import SelectFacet from '@apps/search/SelectFacet';
import TranslationContext from '@apps/search/TranslationContext';
import { FacetStateContext } from '@performant-software/core-data';
import { useRuntimeConfig } from '@peripleo/peripleo';
import clsx from 'clsx';
import { useCallback, useContext } from 'react';
import _ from 'underscore';

const TYPE_LIST = 'list';
const TYPE_SELECT = 'select';

interface Props {
  className?: string;
}

const Facets = (props: Props) => {
  const config = useRuntimeConfig();
  const { attributes, rangeAttributes } = useContext(FacetStateContext);
  const { t } = useContext(TranslationContext);

  const renderFacet = useCallback((attribute, index) => {
    const { facets = {} } = config.search;
    const type = facets[attribute] || TYPE_LIST;

    if (type === TYPE_LIST) {
      return (
        <ListFacet
          attribute={attribute}
          className={clsx({
            'border-b border-neutral-200': index < attribute.length - 1
          })}
        />
      );
    }

    if (type === TYPE_SELECT) {
      return (
        <SelectFacet
          attribute={attribute}
          className={clsx({
            'border-b border-neutral-200': index < attribute.length - 1
          })}
        />
      );
    }

    return null;
  }, []);

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
      { _.map(attributes, renderFacet) }
    </aside>
  );
};

export default Facets;