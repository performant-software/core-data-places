import { fetchI18n } from '@backend/tina-server';
import { buildTranslations, getTranslation } from './utils';
import config from '@config';

/**
 * Returns the list of translations from the TinaCMS for the passed language.
 *
 * @param language
 */
export const getTranslations = async (language: string = config.i18n.default_locale) => {
  const data = await fetchI18n(language) || {};
  const translations = buildTranslations(data);

  return {
    t: (key: string, values = {}) => getTranslation(key, translations, values),
    translations
  };
};