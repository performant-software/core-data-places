import client from '@tina/databaseClient';
import { fetchOne, filterAll } from './i18n';

export const fetchBranding = async () => {
  if (!client.queries.branding) {
    return null;
  }

  const response = await client.queries.branding({ relativePath: 'branding.json' });
  return response.data?.branding;
}

export const fetchI18n = async (language: string) => {
  if (!client.queries.i18n) {
    return null;
  }

  const response = await client.queries.i18n({ relativePath: `${language}.json` });
  return response.data?.i18n;
};

export const fetchI18ns = async () => {
  if (!client.queries.i18nConnection) {
    return null;
  }

  const response = await client.queries.i18nConnection();
  return response.data?.i18nConnection?.edges?.map((item) => item?.node);
};

export const fetchNavbar = async (language: string) => {
  if (!client.queries.navbar) {
    return null;
  }
  
  const response = await client.queries.navbar({ relativePath: `${language}.json` });
  return response.data?.navbar;
}

export const fetchPage = async (locale: string, slug: string) => {
  if (!client.queries.pages) {
    return null;
  }

  const response = await fetchOne(locale, slug, client.queries.pages);

  return response.data?.pages;
};

export const fetchPages = async (locale: string, params?: any) => {
  if (!client.queries.pagesConnection) {
    return null;
  }

  const response = await client.queries.pagesConnection(params);
  const pages = response.data?.pagesConnection?.edges?.map((item) => item?.node);

  return filterAll(locale, pages);
};

export const fetchPath = async (slug: string) => {
  if (!client.queries.path) {
    return null;
  }

  const response = await client.queries.path({ relativePath: `${slug}.mdx`});
  return response.data?.path;
};

export const fetchPathResponse = async (slug: string) => {
  if (!client.queries.path) {
    return null;
  }

  const response = await client.queries.path({ relativePath: `${slug}.mdx`});
  return response;
};

export const fetchPaths = async (params = {}) => {
  if (!client.queries.pathConnection) {
    return null;
  }

  const response = await client.queries.pathConnection(params);

  return {
    metadata: response.data?.pathConnection?.pageInfo,
    paths: response.data?.pathConnection?.edges?.map((item) => item?.node)
  }
};

export const fetchPost = async (slug: string) => {
  if (!client.queries.post) {
    return null;
  }

  const response = await client.queries.post({ relativePath: `${slug}.mdx`});
  return response.data?.post;
};

export const fetchPostResponse = async (slug: string) => {
  if (!client.queries.post) {
    return null;
  }

  const response = await client.queries.post({ relativePath: `${slug}.mdx`});
  return response;
}

export const fetchPosts = async (params = {}) => {
  if (!client.queries.postConnection) {
    return null;
  }

  const response = await client.queries.postConnection(params);

  return {
    metadata: response.data?.postConnection?.pageInfo,
    posts: response.data?.postConnection?.edges?.map((item) => item?.node)
  }
};

