import _ from 'underscore';
import i18n from './i18n.json';
import userDefinedFields from './userDefinedFields.json';

export const TRANSLATION_PREFIX = 't_';

export const t = (key) => getTranslationKey(key);

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

export const buildTranslations = (data) => {
  /**
   * TODO: Comment me
   */
  const translations = {};

  Object.keys(data).forEach((key) => {
    if (key.startsWith(TRANSLATION_PREFIX)) {
      translations[key] = data[key] || undefined;
    }
  });

  /**
   * TODO: Comment me.
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