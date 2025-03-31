import { fetchI18n } from '@backend/tina';
import { hasContentCollection } from '@root/src/content.config';
import { getEntry } from 'astro:content';

/**
 * Returns the i18n data for the passed locale.
 *
 * @param locale
 */
export const getI18n = async (locale) => {
  let data;

  if (hasContentCollection(locale)) {
    data = await getEntry('i18n', locale);
  } else {
    data = await fetchI18n(locale);
  }

  return data;
};