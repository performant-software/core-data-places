import { fetchI18n } from '@backend/tina-cms';
import { buildTranslations, getTranslation } from './utils';

/**
 * Returns the list of translations from the TinaCMS for the passed language.
 *
 * @param language
 */
export const getTranslations = async (language: string) => {
  const data = await fetchI18n(language) || {};
  const translations = buildTranslations(data);

  return {
    t: (key: string, values = {}) => getTranslation(key, translations, values),
    translations
  };
};