import { buildUrl } from '@utils/url';

const BASE_URL = '/api/paths/index.json';

export const fetchPaths = async (params: any = {}) => {
  const url = buildUrl(BASE_URL, params)

  const res = await fetch(url)

  return await res.json();
};
