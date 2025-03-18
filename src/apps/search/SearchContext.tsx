import { createContext } from 'react';

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
  controlsClass?: string;
}

const SearchContext = createContext<SearchContextType>(null);

export default SearchContext;