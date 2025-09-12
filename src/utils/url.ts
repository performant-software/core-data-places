import _ from 'underscore';

interface SearchParams {
  [key: string]: string;
}

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