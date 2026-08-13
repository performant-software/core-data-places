const i18nCache = new Map();

export const fetchI18n = async (locale) => {
  if (i18nCache.has(locale)) {
    return i18nCache.get(locale);
  }

  const response = await fetch(`/api/i18n/${locale}.json`)
  const data = await response.json();
  i18nCache.set(locale, data);
  return data;
};
