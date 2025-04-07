import config from '@config';
import { getI18n } from '@services/i18n';
import { buildResponse } from '@utils/api';
import { APIRoute } from 'astro';
import _ from 'underscore';

export const GET: APIRoute = async ({ params }) => {
  const { locale } = params;

  const data = await getI18n(locale);

  return buildResponse(data);
};

export const getStaticPaths = () => _.map(config.i18n.locales, (locale) => ({ params: { locale }}));