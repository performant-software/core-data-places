import { fetchPages } from '@backend/tina';
import _ from 'underscore';

/**
 * Returns the set of all non-homepage pages.
 */
export const getPages = async (locale: string) => {
  const pages = await fetchPages(locale, { filter: { nav_bar: { eq: true } } });
  return _.filter(pages, (page) => !page.home_page);
};