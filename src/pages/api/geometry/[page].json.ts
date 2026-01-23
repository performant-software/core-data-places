import { getAll, getCount, PER_PAGE } from '@services/geometry';
import { buildResponse } from '@utils/api';
import { getPages } from '@utils/list';
import { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  const { page } = params;

  const data = await getAll(Number(page));
  return buildResponse(data);
};

export const getStaticPaths = async () => {
  const routes = [];

  const count = await getCount();
  const pages = getPages(count, PER_PAGE);

  for (let page = 1; page <= pages; page += 1) {
    routes.push({ params: { page }});
  }
};