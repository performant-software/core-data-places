import { createContext } from 'react';

interface TranslationContextType {
  t: (key: string, params?: { [key: string]: string }) => string;
}

const TranslationContext = createContext<TranslationContextType>(null);

export default TranslationContext;