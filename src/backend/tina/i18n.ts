import config from '@config';
import _ from 'underscore';

/**
 * Filters the passed array of items to include the correct localized content.
 *
 * @param locale
 * @param items
 */
export const filterAll = async (locale: string, items: Array<any>) => {
  if (!config.content.localize_pages) {
    return items;
  }

  // Group the pages by filename
  const grouped = {};

  _.each(items, (item) => {
    const { basename } = item._sys;
    const [locale,] = item._sys.relativePath.split('/');

    _.extend(grouped, {
      [basename]: {
        ...grouped[basename],
        [locale]: item
      }
    });
  });

  // Filter the pages to only include one per file name based on the passed locale
  const filtered = [];

  _.each(_.keys(grouped), (basename) => {
    const localized = grouped[basename];

    if (localized[locale]) {
      filtered.push(localized[locale]);
    } else if (localized[config.i18n.default_locale]) {
      filtered.push(localized[config.i18n.default_locale])
    }
  });

  return filtered;
};

/**
 * Returns the localized content for the passed slug/query.
 *
 * @param locale
 * @param slug
 * @param query
 */
export const fetchOne = async (locale: string, slug: string, query: any) => {
  let response;

  if (!config.content.localize_pages) {
    response = await query({ relativePath: `${slug}.mdx` });
  } else {
    response = await query({ relativePath: `${locale}/${slug}.mdx` });

    if (!response.data && locale !== config.i18n.default_locale) {
      response = await query({ relativePath: `${config.i18n.default_locale}/${slug}.mdx` });
    }
  }

  return response;
};