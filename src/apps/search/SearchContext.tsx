import { useRuntimeConfig } from '@peripleo/peripleo';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import _ from 'underscore';
import type { Configuration, SearchConfig } from '@types';

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
  allowSave: boolean;
  boundingBoxOptions: BoundingBoxOptions;
  searchConfig: SearchConfig;
  setBoundingBoxOptions(boundingBoxOptions: BoundingBoxOptions): void;
  controlsClass?: string;
  setControlsClass(controlsClass: string): void;
}

const SearchContext = createContext<SearchContextType>(null);

interface Props {
  allowSave?: boolean;
  children: ReactNode;
  name: string;
}

export const SearchContextProvider = ({ allowSave, children, name }: Props) => {
  const [boundingBoxOptions, setBoundingBoxOptions] = useState<BoundingBoxOptions>();
  const [controlsClass, setControlsClass] = useState<string>();

  const config = useRuntimeConfig<Configuration>();
  const searchConfig = useMemo(() => _.findWhere(config.search, { name }), [config, name]);

  return (
    <SearchContext.Provider
      value={{
        allowSave,
        boundingBoxOptions,
        controlsClass,
        searchConfig,
        setBoundingBoxOptions,
        setControlsClass
      }}
    >
      { children }
    </SearchContext.Provider>
  )
};

export const useSearchConfig = () => {
  const { searchConfig } = useContext(SearchContext);
  return searchConfig;
};

export default SearchContext;