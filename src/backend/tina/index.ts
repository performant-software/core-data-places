import client from '@tina/databaseClient';
import { fetchOne, filterAll } from './i18n';

export const fetchBranding = async () => {
  const response = await client.queries.branding({ relativePath: 'branding.json' });
  return response.data?.branding;
}

export const fetchI18n = async (language: string) => {
  const response = await client.queries.i18n({ relativePath: `${language}.json` });
  return response.data?.i18n;
};

export const fetchI18ns = async () => {
  const response = await client.queries.i18nConnection();
  return response.data?.i18nConnection?.edges?.map((item) => item?.node);
};

export const fetchPage = async (locale: string, slug: string) => {
  const response = await fetchOne(locale, slug, client.queries.pages);
  return response.data?.pages;
};

export const fetchPages = async (locale: string, params?: any) => {
  const response = await client.queries.pagesConnection(params);
  const pages = response.data?.pagesConnection?.edges?.map((item) => item?.node);

  return filterAll(locale, pages);
};

export const fetchPath = async (locale: string, slug: string) => {
  const response = await fetchOne(locale, slug, client.queries.path);
  return response.data?.path;
};

export const fetchPaths = async (locale: string) => {
  const response = await client.queries.pathConnection();
  const paths = response.data?.pathConnection?.edges?.map((item) => item?.node);

  return filterAll(locale, paths)
};

export const fetchPost = async (locale: string, slug: string) => {
  const response = await fetchOne(locale, slug, client.queries.post);
  return response.data?.post;
};

export const fetchPosts = async (locale: string) => {
  const response = await client.queries.postConnection();
  const posts = response.data?.postConnection?.edges?.map((item) => item?.node);
  
  return filterAll(locale, posts)
};