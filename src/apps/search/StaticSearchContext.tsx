import type { ItemsJsOptions } from '@utils/staticSearch';
import { createContext, useContext } from 'react';

interface StaticSearchContextType {
  options: ItemsJsOptions;
}

const StaticSearchContext = createContext<StaticSearchContextType>(null as unknown as StaticSearchContextType);

export const useStaticSearch = () => useContext(StaticSearchContext);

export default StaticSearchContext;
