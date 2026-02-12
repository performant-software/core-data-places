import config from '@config' with { type: 'json' };
import { getI18n } from '@services/i18n';
import { buildResponse } from '@utils/api';
import { APIRoute } from 'astro';
import _ from 'underscore';

export const GET: APIRoute = async ({ params }) => {
  const { locale } = params;

  console.time('Fetching i18n data...');
  const data = await getI18n(locale);
  console.timeEnd('Fetching i18n data...');

  return buildResponse(data);
};

export const getStaticPaths = () => _.map(config.i18n.locales, (locale) => ({ params: { locale }}));