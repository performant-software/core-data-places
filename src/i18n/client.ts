import { buildTranslations, getTranslation } from '@i18n/utils';
import client from '@tina/client';
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
  const onLoad = useCallback((response) => {
    const translationData = buildTranslations(response?.data?.i18n || {});
    setTranslations(translationData);
  }, []);

  /**
   * Loads the list of translations from the TinaCMS backend.
   */
  useEffect(() => {
    const language = getLanguageFromUrl(window.location.pathname);

    client
      .queries
      .i18n({ relativePath: `${language}.json` })
      .then(onLoad);
  }, []);

  return {
    t,
    translations
  }
};