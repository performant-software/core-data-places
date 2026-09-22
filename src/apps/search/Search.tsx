import { useSearchConfig } from '@apps/search/SearchConfigContext';
import StaticSearch from '@apps/search/StaticSearch';
import TypesenseSearch from '@apps/search/TypesenseSearch';
import type { ReactNode } from 'react';

const Search = (props: { children: ReactNode }) => {
  const config = useSearchConfig();

  if (config?.static) {
    return (
      <StaticSearch>
        { props.children }
      </StaticSearch>
    );
  }

  return (
    <TypesenseSearch>
      { props.children }
    </TypesenseSearch>
  );
};

export default Search;
