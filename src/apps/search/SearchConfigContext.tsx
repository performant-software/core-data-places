import {
  createContext,
  useContext,
  useMemo,
  type ReactNode
} from 'react';
import _ from 'underscore';
import type { SearchConfig } from '@types';
import config from '@config';

interface SearchContextType {
  searchConfig: SearchConfig;
}

const SearchConfigContext = createContext<SearchContextType>(null);

interface Props {
  children: ReactNode;
  name: string;
}

export const SearchConfigContextProvider = ({ children, name }: Props) => {
  const searchConfig = useMemo(() => _.findWhere(config.search, { name }), [config, name]);

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