import { APIRoute } from 'astro';
import { getI18n } from '@services/i18n';

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