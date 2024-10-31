import { useCallback, useEffect, useState } from 'react';
import client from '../../tina/__generated__/client';
import { buildTranslations, getTranslation } from './utils';

export const getLanguageFromUrl = (url: string) => {
  const [, lang] = url.split('/');
  return lang;
};

export const useTranslations = () => {
  const [translations, setTranslations] = useState({});

  const t = useCallback((key, values = {}) => getTranslation(key, translations, values), [translations]);

  const onLoad = useCallback((response) => {
    const translationData = buildTranslations(response?.data?.ui || {});
    setTranslations(translationData);
  }, []);

  useEffect(() => {
    const language = getLanguageFromUrl(window.location.pathname);
    console.log(language);

    client
      .queries
      .ui({ relativePath: `${language}.json` })
      .then(onLoad);
  }, []);

  return {
    t,
    translations
  }
};