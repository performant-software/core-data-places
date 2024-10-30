import _ from 'underscore';
import i18n from './i18n.json';

export const TRANSLATION_PREFIX = 't_';

export const t = (key) => getTranslationKey(key);

export const getTranslation = (key, translations) => translations[getTranslationKey(key)];

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

  Object.keys(i18n).forEach((key) => {
    defaultTranslations[getTranslationKey(key)] = i18n[key].defaultValue || undefined;
  });

  return _.defaults(translations, defaultTranslations);
};