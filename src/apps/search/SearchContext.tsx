import { useRuntimeConfig } from '@peripleo/peripleo';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import _ from 'underscore';
import type { SearchConfig } from '@types';

interface BoundingBoxOptions {
  padding: {
    top: number,
    bottom: number,
    left: number,
    right: number
  };
  maxZoom: number;
}

interface SearchContextType {
  boundingBoxOptions: BoundingBoxOptions;
  searchConfig: SearchConfig;
  setBoundingBoxOptions(boundingBoxOptions: BoundingBoxOptions): void;
  controlsClass?: string;
  setControlsClass(controlsClass: string): void;
}

const SearchContext = createContext<SearchContextType>(null);

interface Props {
  children: ReactNode;
  name: string;
}

export const SearchContextProvider = (props: Props) => {
  const [boundingBoxOptions, setBoundingBoxOptions] = useState<BoundingBoxOptions>();
  const [controlsClass, setControlsClass] = useState<string>();

  const config = useRuntimeConfig();
  const searchConfig = useMemo(() => _.findWhere(config.search, { name: props.name }), [config, props.name]);

  return (
    <SearchContext.Provider
      value={{
        boundingBoxOptions,
        controlsClass,
        searchConfig,
        setBoundingBoxOptions,
        setControlsClass
      }}
    >
      { props.children }
    </SearchContext.Provider>
  )
};

export const useSearchConfig = () => {
  const { searchConfig } = useContext(SearchContext);
  return searchConfig;
};

export default SearchContext;