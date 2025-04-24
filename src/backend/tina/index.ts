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

export const fetchPath = async (slug: string) => {
  const response = await client.queries.path({ relativePath: `${slug}.mdx`});
  return response.data?.path;
};

export const fetchPaths = async () => {
  const response = await client.queries.pathConnection();
  return response.data?.pathConnection?.edges?.map((item) => item?.node);
};

export const fetchPost = async (slug: string) => {
  const response = await client.queries.post({ relativePath: `${slug}.mdx`});
  return response.data?.post;
};

export const fetchPosts = async () => {
  const response = await client.queries.postConnection();
  return response.data?.postConnection?.edges?.map((item) => item?.node);
};