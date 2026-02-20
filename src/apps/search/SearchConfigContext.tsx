import {
  createContext,
  useContext,
  useMemo,
  type ReactNode
} from 'react';
import _ from 'underscore';
import type { SearchConfig } from '@types';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { RuntimeConfig, useRuntimeConfig } from '@peripleo/peripleo';

interface SearchContextType {
  searchConfig: SearchConfig;
}

const SearchConfigContext = createContext<SearchContextType>(null);

interface Props {
  children: ReactNode;
  name: string;
}

export const RuntimeConfigProvider = ({ children, name }: Props) => (
  <RuntimeConfig
    path='/config.json'
    preprocess={PeripleoUtils.normalize}
  >
    <SearchConfigContextProvider
      name={name}
    >
      { children }
    </SearchConfigContextProvider>
  </RuntimeConfig>
)

const SearchConfigContextProvider = ({ children, name }: Props) => {
  const config = useRuntimeConfig();
  const searchConfig = useMemo(() => _.findWhere(config.search, { name }), [name, config.search]);

  return (
    <SearchConfigContext.Provider
      value={{
        searchConfig
      }}
    >
      { children }
    </SearchConfigContext.Provider>
  )
};

export const useSearchConfig = () => {
  const { searchConfig } = useContext(SearchConfigContext);
  return searchConfig;
};

export default SearchConfigContext;