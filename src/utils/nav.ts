import { fetchPages } from '@backend/tina';
import config from '@config';
import _ from 'underscore';

/**
 * Returns the first page flagged as "home_page". If none exists for the current locale, will default to the configured `default_locale` if possible.
 *
 * @param locale
 */
export const getHomepage = async (locale: string) => {
  const pages = await fetchPages(locale, { filter: { home_page: { eq: true } } });
  let page: any;
  if (pages && pages.length) {
    page = pages[0];
  } else if (config.i18n.default_locale) {
    const defaultPages = await fetchPages(config.i18n.default_locale, { filter: { home_page: { eq: true } } });
    if (defaultPages && defaultPages.length) {
      page = defaultPages[0];
    }
  }

  return page;
};

/**
 * Returns the set of all non-homepage pages.
 */
export const getPages = async (locale: string) => {
  const pages = await fetchPages(locale, { filter: { nav_bar: { eq: true } } });
  return _.filter(pages, (page) => !page.home_page);
};