import { fetchPages } from '@backend/tina';
import _ from 'underscore';

/**
 * Returns the first page flagged as "home_page".
 *
 * @param locale
 */
export const getHomepage = async (locale: string) => {
  const pages = await fetchPages(locale, { filter: { home_page: { eq: true } } });
  const [page, ] = pages;

  return page;
};

/**
 * Returns the set of all non-homepage pages.
 */
export const getPages = async (locale: string) => {
  const pages = await fetchPages(locale, { filter: { nav_bar: { eq: true } } });
  return _.filter(pages, (page) => !page.home_page);
};