import { buildUrl } from '@utils/url';

const BASE_URL = '/api/posts/index.json';

export const fetchPosts = async (params: any = {}) => {
  const url = buildUrl(BASE_URL, params)

  const res = await fetch(url)

  return await res.json();
};
