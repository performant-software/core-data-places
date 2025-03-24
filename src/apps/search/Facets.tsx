import ClearRefinementsButton from '@apps/search/ClearRefinementsButton';
import CurrentRefinementsList from '@apps/search/CurrentRefinementsList';
import GeosearchFilter from '@apps/search/GeosearchFilter';
import ListFacet from '@apps/search/ListFacet';
import RangeFacet from '@apps/search/RangeFacet';
import { useSearchConfig } from '@apps/search/SearchContext';
import SelectFacet from '@apps/search/SelectFacet';
import TranslationContext from '@apps/search/TranslationContext';
import { FacetStateContext } from '@performant-software/core-data';
import clsx from 'clsx';
import { useCallback, useContext } from 'react';
import _ from 'underscore';

const TYPE_LIST = 'list';
const TYPE_RANGE = 'range';
const TYPE_SELECT = 'select';

interface Props {
  className?: string;
}

const Facets = (props: Props) => {
  const config = useSearchConfig();
  const { attributes, rangeAttributes } = useContext(FacetStateContext);
  const { t } = useContext(TranslationContext);

  /**
   * Returns the `search.facets` value for the passed attribute key populated with the passed default values.
   */
  const getFacetConfiguration = useCallback((name, defaults = {}) => {
    const { facets = {} } = config;
    const facet = _.defaults(_.findWhere(facets, { name }) || {}, defaults);

    return facet;
  }, [config]);

  /**
   * Renders the facet for the passed attribute.
   */
  const renderFacet = useCallback((attribute, type) => {
    const facet = getFacetConfiguration(attribute, { type });

    if (facet.type === TYPE_LIST) {
      return (
        <ListFacet
          attribute={attribute}
          icon={facet.icon}
        />
      );
    }

    if (facet.type === TYPE_SELECT) {
      return (
        <SelectFacet
          attribute={attribute}
          icon={facet.icon}
        />
      );
    }

    if (facet.type === TYPE_RANGE) {
      return (
        <RangeFacet
          attribute={attribute}
          icon={facet.icon}
        />
      );
    }

    return null;
  }, [getFacetConfiguration]);

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
      { _.map(rangeAttributes, (attribute) => renderFacet(attribute, TYPE_RANGE)) }
      { _.map(attributes, (attribute) => renderFacet(attribute, TYPE_LIST)) }
    </aside>
  );
};

export default Facets;