import databaseClient from '../../tina/__generated__/databaseClient';
import { buildTranslations, getTranslation } from './utils';

export const getTranslations = async (language: string) => {
  const response = await databaseClient.queries.ui({ relativePath: `${language}.json` });
  const data = response?.data?.ui || {};
  const translations = buildTranslations(data);

  return {
    t: (key: string, values = {}) => getTranslation(key, translations, values),
    translations
  };
};