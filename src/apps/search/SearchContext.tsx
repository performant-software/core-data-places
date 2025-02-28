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
}

const SearchContext = createContext<SearchContextType>(null);

export default SearchContext;