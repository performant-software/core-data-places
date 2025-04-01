import config from '@config';
import { getI18n } from '@services/i18n';
import { APIRoute } from 'astro';
import _ from 'underscore';

export const GET: APIRoute = async ({ params }) => {
  const { locale } = params;

  const data = await getI18n(locale);

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getStaticPaths = () => _.map(config.i18n.locales, (locale) => ({ params: { locale }}));