import { createContext } from 'react';

interface TranslationContextType {
  t(key: string, values?: { [key: string] : string | number })
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export default TranslationContext;