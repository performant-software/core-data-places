import { getI18n } from '@services/i18n';
import { buildTranslations, getTranslation } from '@i18n/utils';
import config from '@config';

/**
 * Returns the list of translations from the TinaCMS for the passed language.
 *
 * @param language
 */
export const getTranslations = async (language: string = config.i18n.default_locale) => {
  const data = await getI18n(language) || {};
  const translations = buildTranslations(data);

  const t = (key: string, values: { [key: string]: string | number } = {}) => getTranslation(key, translations, values);

  return { t, translations };
};