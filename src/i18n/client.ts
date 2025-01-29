import { fetchI18n } from '@backend/tina-client';
import { buildTranslations, getTranslation } from '@i18n/utils';
import { useCallback, useEffect, useState } from 'react';

export const getLanguageFromUrl = (url: string) => {
  const [, lang] = url.split('/');
  return lang;
};

export const useTranslations = () => {
  const [translations, setTranslations] = useState({});

  /**
   * Returns the translation value for the passed key.
   */
  const t = useCallback((key, values = {}) => getTranslation(key, translations, values), [translations]);

  /**
   * Builds the list of translations and sets the value on the state.
   */
  const onLoad = useCallback((i18n) => {
    const translationData = buildTranslations(i18n || {});
    setTranslations(translationData);
  }, []);

  /**
   * Loads the list of translations from the TinaCMS backend.
   */
  useEffect(() => {
    const language = getLanguageFromUrl(window.location.pathname);

    fetchI18n(language)
      .then(onLoad);
  }, []);

  return {
    t,
    translations
  }
};