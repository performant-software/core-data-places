import { getEntry } from 'astro:content';

/**
 * Returns the navbar data for the passed locale.
 *
 * @param locale
 */
export const getNavbar = async (locale) => {

  const resp = await getEntry('navbar', locale);

  return resp?.data;
};