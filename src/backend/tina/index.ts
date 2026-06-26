import client from '@tina/databaseClient';
import { fetchOne, filterAll } from './i18n';

interface Caches {
  i18n: Map<string, any>;
  i18ns: any;
  navbar: Map<string, any>;
  pages: Map<string, any>;
  paths: Map<string, any>;
  pathsResponse: Map<string, any>;
  posts: Map<string, any>;
  postsResponse: Map<string, any>;
}

const caches: Caches = {
  i18n: new Map(),
  i18ns: undefined,
  navbar: new Map(),
  pages: new Map(),
  paths: new Map(),
  pathsResponse: new Map(),
  posts: new Map(),
  postsResponse: new Map()
}

export const fetchI18n = async (language: string) => {
  if (!client.queries.i18n) {
    return null;
  }

  if (caches.i18n.has(language)) {
    console.log('i18n cache hit');
    return caches.i18n.get(language);
  }

  const response = await client.queries.i18n({ relativePath: `${language}.json` });
  const data = response.data?.i18n;
  caches.i18n.set(language, data);
  return data;
};

export const fetchI18ns = async () => {
  if (!client.queries.i18nConnection) {
    return null;
  }

  if (caches.i18ns) {
    console.log('i18ns cache hit');
    return caches.i18ns;
  }

  const response = await client.queries.i18nConnection();
  const data = response.data?.i18nConnection?.edges?.map((item) => item?.node);
  caches.i18ns = data;
  return data;
};

export const fetchNavbar = async (language: string) => {
  if (!client.queries.navbar) {
    return null;
  }

  if (caches.navbar.has(language)) {
    console.log('navbar cache hit');
    return caches.navbar.get(language);
  }

  const response = await client.queries.navbar({ relativePath: `${language}.json` });
  const data = response.data?.navbar;
  caches.navbar.set(language, data);
  return data;
}

export const fetchPage = async (locale: string, slug: string) => {
  if (!client.queries.pages) {
    return null;
  }

  if (caches.pages.has(`${locale}-${slug}`)) {
    console.log('page cache hit');
    return caches.pages.get(`${locale}-${slug}`);
  }

  const response = await fetchOne(locale, slug, client.queries.pages);
  const data = response.data?.pages;
  caches.pages.set(`${locale}-${slug}`, data);
  return data;
};

export const fetchPages = async (locale: string, params?: any) => {
  if (!client.queries.pagesConnection) {
    return null;
  }

  const paramsStr = JSON.stringify(params);

  if (caches.pages.has(`${locale}-${paramsStr}`)) {
    console.log('pages cache hit');
    return caches.pages.get(`${locale}-${paramsStr}`);
  }

  const response = await client.queries.pagesConnection(params);
  const data = response.data?.pagesConnection?.edges?.map((item) => item?.node);
  caches.pages.set(`${locale}-${paramsStr}`, data);
  return filterAll(locale, data);
};

export const fetchPathResponse = async (slug: string) => {
  if (!client.queries.path) {
    return null;
  }

  if (caches.pathsResponse.has(slug)) {
    console.log('path cache hit');
    return caches.pathsResponse.get(slug);
  }

  const response = await client.queries.path({ relativePath: `${slug}.mdx`});
  caches.pathsResponse.set(slug, response);
  return response;
};

export const fetchPaths = async (params = {}) => {
  if (!client.queries.pathConnection) {
    return null;
  }

  const paramsStr = JSON.stringify(params);

  if (caches.paths.has(paramsStr)) {
    console.log('paths cache hit');
    return caches.paths.get(paramsStr);
  }

  const response = await client.queries.pathConnection(params);
  const data = {
    metadata: response.data?.pathConnection?.pageInfo,
    paths: response.data?.pathConnection?.edges?.map((item) => item?.node)
  }
  caches.paths.set(paramsStr, data);
  return data;
};

export const fetchPostResponse = async (slug: string) => {
  if (!client.queries.post) {
    return null;
  }

  if (caches.postsResponse.has(slug)) {
    console.log('post cache hit');
    return caches.postsResponse.get(slug);
  }

  const response = await client.queries.post({ relativePath: `${slug}.mdx`});
  caches.postsResponse.set(slug, response);
  return response;
}

export const fetchPosts = async (params = {}) => {
  if (!client.queries.postConnection) {
    return null;
  }

  const paramsStr = JSON.stringify(params);
  if (caches.posts.has(paramsStr)) {
    console.log('posts cache hit');
    return caches.posts.get(paramsStr);
  }

  const response = await client.queries.postConnection(params);
  const data = {
    metadata: response.data?.postConnection?.pageInfo,
    posts: response.data?.postConnection?.edges?.map((item) => item?.node)
  }

  caches.posts.set(paramsStr, data);
  return data;
};

