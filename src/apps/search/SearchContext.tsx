import { useRuntimeConfig } from '@peripleo/peripleo';
import { createContext, useContext, useMemo, useState } from 'react';

interface SearchContextType {
  boundingBoxOptions: {
    padding: {
      top: number,
      bottom: number,
      left: number,
      right: number
    },
    maxZoom: number
  };
  searchConfig: any; // TODO: Fix me
  setBoundingBoxOptions(any): void; // TODO: Fix me
  controlsClass?: string;
  setControlsClass(any): void; // TODO: Fix me
}

const SearchContext = createContext<SearchContextType>(null);

export const SearchContextProvider = (props) => {
  const [boundingBoxOptions, setBoundingBoxOptions] = useState();
  const [controlsClass, setControlsClass] = useState();

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