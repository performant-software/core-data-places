import ClearRefinementsButton from '@apps/search/map/ClearRefinementsButton';
import CurrentRefinementsList from '@apps/search/map/CurrentRefinementsList';
import ListFacet from '@apps/search/map/ListFacet';
import RangeFacet from '@apps/search/map/RangeFacet';
import SelectFacet from '@apps/search/map/SelectFacet';
import TranslationContext from '@contexts/TranslationContext';
import { FacetStateContext } from '@performant-software/core-data';
import clsx from 'clsx';
import { useCallback, useContext, useMemo } from 'react';
import _ from 'underscore';
import { SearchConfig } from "@types";

const TYPE_LIST = 'list';
const TYPE_RANGE = 'range';
const TYPE_SELECT = 'select';

interface Props {
  className?: string;
  children?: React.ReactNode;
  config: SearchConfig;
  open?: boolean;
}

const Facets = (props: Props) => {
  const { attributes, rangeAttributes } = useContext(FacetStateContext);
  const { t } = useContext(TranslationContext);

  const { typesense } = props.config;

  const sortAttributes = useCallback((atts: string[]) => {
    const copy = [...atts];
    if (!copy) {
      return [];
    }
    if (typesense?.facets?.include) {
      return copy.sort((a,b) => {
        const index_a = typesense.facets.include.findIndex((facet) => facet === a);
        const index_b = typesense.facets.include.findIndex((facet) => facet === b);
        return index_a - index_b;
      })
    } else {
      return copy;
    }
  }, [typesense])

  const sortedAttributes = useMemo(() => sortAttributes(attributes), [attributes, sortAttributes]);

  const sortedRangeAttributes = useMemo(() => sortAttributes(rangeAttributes), [rangeAttributes, sortAttributes]);

  /**
   * Returns the `search.facets` value for the passed attribute key populated with the passed default values.
   */
  const getFacetConfiguration = useCallback((name, defaults = {}) => {
    const { facets = {} } = props.config;
    const facet = _.defaults(_.findWhere(facets, { name }) || {}, defaults);

    return facet;
  }, [props.config]);

  /**
   * Renders the facet for the passed attribute.
   */
  const renderFacet = useCallback((attribute, type) => {
    const facet = getFacetConfiguration(attribute, { type });

    if (facet.type === TYPE_LIST) {
      return (
        <ListFacet
          attribute={attribute}
          key={attribute}
          icon={facet.icon}
        />
      );
    }

    if (facet.type === TYPE_SELECT) {
      return (
        <SelectFacet
          attribute={attribute}
          key={attribute}
          icon={facet.icon}
        />
      );
    }

    if (facet.type === TYPE_RANGE) {
      return (
        <RangeFacet
          attribute={attribute}
          key={attribute}
          icon={facet.icon}
        />
      );
    }

    return null;
  }, [getFacetConfiguration]);

  return (
    <aside
      className={clsx(
        { 'flex flex-col grow': props.open },
        { 'hidden': !props.open },
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
      {props.children}
      { _.map(sortedRangeAttributes, (attribute) => renderFacet(attribute, TYPE_RANGE)) }
      { _.map(sortedAttributes, (attribute) => renderFacet(attribute, TYPE_LIST)) }
    </aside>
  );
};

export default Facets;