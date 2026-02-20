import { DISABLE_CACHE } from 'astro:env/client';
import _ from 'underscore';

interface SearchParams {
  [key: string]: string;
}

const HEADER_REFERER = 'Referer';

/**
 * Returns the fully formed URL and search parameters for the passed arguments.
 *
 * @param baseUrl
 * @param params
 */
export const buildUrl = (baseUrl: string, params: { [key: string]: string } = {}) => {
  const url = [baseUrl];

  if (!_.isEmpty(params)) {
    url.push(new URLSearchParams(params).toString());
  }

  return url.join('?');
};

export const convertToNumber = (str) => {
  const num = Number(str);

  if (!isNaN(num)) {
    return num;
  }

  return str;
};

/**
 * Returns the referer URL on the passed headers.
 *
 * @param headers
 */
export const getCurrentURL = (headers: Headers): URL => {
  const referer = headers.get(HEADER_REFERER);
  return new URL(referer);
};

/**
 * Parses the search parameters from the passed URL string and returns it as an object.
 *
 * @param urlString
 */
export const parseSearchParams = (urlString: string): SearchParams => {
  const params = {};

  const url = new URL(urlString);

  if (!_.isEmpty(url.search)) {
    const searchParams = new URLSearchParams(url.search.substring(1, url.search.length));

    searchParams.forEach((value, key) => {
      params[key] = value;
    });
  }

  return params;
};

/**
 * Sets the cache control on the passed headers.
 *
 * @param headers
 */
export const setCacheControl = (headers: Headers): void => {
  if (DISABLE_CACHE) {
    return;
  }

  // Tell the browser to always check the freshness of the cache
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');

  // Tell Netlify's CDN to treat it as fresh for 5 minutes, then for up to a week return a stale version
  // while it revalidates. Use Durable Cache to minimize the need for serverless function calls.
  headers.set('Netlify-CDN-Cache-Control', 'public, durable, s-maxage=300, stale-while-revalidate=604800');
};
