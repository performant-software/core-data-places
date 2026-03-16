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
  const page = response.data?.pages;

  // Home page always renders; other pages require published === true
  if (page && !page.home_page && page.published !== true) return null;

  return page;
};

export const fetchPages = async (locale: string, params?: any) => {
  if (!client.queries.pagesConnection) {
    return null;
  }

  const response = await client.queries.pagesConnection({
    ...params,
    filter: { ...params?.filter, published: { eq: true } }
  });
  const pages = response.data?.pagesConnection?.edges?.map((item) => item?.node);

  return filterAll(locale, pages);
};

export const fetchPath = async (slug: string, skipPublishedCheck = false) => {
  if (!client.queries.path) {
    return null;
  }

  const response = await client.queries.path({ relativePath: `${slug}.mdx`});
  const path = response.data?.path;

  if (!skipPublishedCheck && path && path.published !== true) return null;

  return path;
};

export const fetchPathResponse = async (slug: string) => {
  if (!client.queries.path) {
    return null;
  }

  const response = await client.queries.path({ relativePath: `${slug}.mdx`});
  return response;
};

export const fetchPaths = async () => {
  if (!client.queries.pathConnection) {
    return null;
  }

  const response = await client.queries.pathConnection({
    filter: { published: { eq: true } }
  });
  return response.data?.pathConnection?.edges?.map((item) => item?.node);
};

export const fetchPost = async (slug: string, skipPublishedCheck = false) => {
  if (!client.queries.post) {
    return null;
  }

  const response = await client.queries.post({ relativePath: `${slug}.mdx`});
  const post = response.data?.post;

  if (!skipPublishedCheck && post && post.published !== true) return null;

  return post;
};

export const fetchPostResponse = async (slug: string) => {
  if (!client.queries.post) {
    return null;
  }

  const response = await client.queries.post({ relativePath: `${slug}.mdx`});
  return response;
}

export const fetchPosts = async (params: any = {}) => {
  if (!client.queries.postConnection) {
    return null;
  }

  const response = await client.queries.postConnection({
    ...params,
    filter: { ...params?.filter, published: { eq: true } }
  });

  return {
    metadata: response.data?.postConnection?.pageInfo,
    posts: response.data?.postConnection?.edges?.map((item) => item?.node)
  }
};

