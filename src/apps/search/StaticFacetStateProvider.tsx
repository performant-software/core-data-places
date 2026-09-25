import { FacetStateContext } from '@performant-software/core-data';
import { getFacetAttributes, type ItemsJsOptions } from '@utils/staticSearch';
import { useMemo, type ReactNode } from 'react';
import { useRange, useRefinementList } from 'react-instantsearch';
import _ from 'underscore';

interface ProxyProps {
  attribute: string;
}

const RangeProxy = ({ attribute }: ProxyProps) => {
  useRange({ attribute });

  return null;
};

const RefinementListProxy = ({ attribute }: ProxyProps) => {
  useRefinementList({ attribute });

  return null;
};

interface Props {
  children: ReactNode;
  exclude?: Array<string>;
  include?: Array<string>;
  options: ItemsJsOptions;
}

const StaticFacetStateProvider = (props: Props) => {
  const { attributes, rangeAttributes } = useMemo(() => getFacetAttributes(props.options, {
    exclude: props.exclude,
    include: props.include
  }), [props.exclude, props.include, props.options]);

  return (
    <FacetStateContext.Provider
      value={{
        attributes,
        rangeAttributes
      }}
    >
      { _.map(attributes, (attribute: string) => (
        <RefinementListProxy
          attribute={attribute}
          key={attribute}
        />
      )) }
      { _.map(rangeAttributes, (attribute: string) => (
        <RangeProxy
          attribute={attribute}
          key={attribute}
        />
      )) }
      { props.children }
    </FacetStateContext.Provider>
  );
};

export default StaticFacetStateProvider;
