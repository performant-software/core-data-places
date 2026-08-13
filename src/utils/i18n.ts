import config from '@config';

export const getDefaultLocale = () => {
  return config.i18n?.default_locale;
}