import databaseClient from '@tina/databaseClient';
import { buildTranslations, getTranslation } from './utils';

/**
 * Returns the list of translations from the TinaCMS for the passed language.
 *
 * @param language
 */
export const getTranslations = async (language: string) => {
  const response = await databaseClient.queries.ui({ relativePath: `${language}.json` });
  const data = response?.data?.ui || {};
  const translations = buildTranslations(data);

  return {
    t: (key: string, values = {}) => getTranslation(key, translations, values),
    translations
  };
};