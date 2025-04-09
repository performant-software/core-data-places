export const fetchI18n = (locale) => {
  return fetch(`/api/i18n/${locale}.json`).then((response) => response.json());
};