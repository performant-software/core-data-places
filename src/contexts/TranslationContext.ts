import { createContext } from 'react';

interface TranslationContextType {
  lang: string;
  t(key: string, values?: { [key: string] : string | number });
}

const TranslationContext = createContext<TranslationContextType>(null);

export default TranslationContext;