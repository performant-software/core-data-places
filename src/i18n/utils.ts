import i18n from './i18n.json';
import userDefinedFields from './userDefinedFields.json';
import _ from 'underscore';

export const TRANSLATION_PREFIX = 't_';

export const getTranslation = (key, translations, values = {}) => {
  let translation = translations[getTranslationKey(key)];

  if (translation) {
    _.each(_.keys(values), (key) => {
      translation = translation.replace(`{{${key}}}`, values[key]);
    });
  }

  return translation;
};

export const getTranslationKey = (key) => {
  return `${TRANSLATION_PREFIX}${key.replaceAll('-', '').replaceAll(' ', '').replaceAll('.', '_')}`;
};

interface TranslationData {
  [key: string]: string
}

export const buildTranslations = (data: TranslationData) => {
  /**
   * Build the list of translations based on the passed data.
   */
  const translations = {};

  Object.keys(data).forEach((key) => {
    if (key.startsWith(TRANSLATION_PREFIX)) {
      translations[key] = data[key] || undefined;
    }
  });

  /**
   * Build the list of default translations based on "@i18n/i18n.json".
   */
  const defaultTranslations = {};

  const defaults = {
    ...i18n,
    ...userDefinedFields
  };

  Object.keys(defaults).forEach((key) => {
    defaultTranslations[getTranslationKey(key)] = defaults[key].defaultValue || undefined;
  });

  return _.defaults(translations, defaultTranslations);
};