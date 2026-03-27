import type { Config, Context } from '@netlify/edge-functions';

const publicDomain = Netlify.env.get('PUBLIC_DOMAIN');
const adminDomain = Netlify.env.get('ADMIN_DOMAIN');

export default async (request: Request, context: Context) => {
  if (!publicDomain || !adminDomain) {
    return context.next();
  }

  if (request.headers.get('sec-fetch-dest') === 'iframe') {
    return context.next();
  }

  const url = new URL(request.url);

  if (url.hostname === publicDomain && url.pathname.startsWith('/admin')) {
    url.hostname = adminDomain;
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }

  if (url.hostname === adminDomain && !url.pathname.startsWith('/admin')) {
    url.hostname = publicDomain;
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
};

export const config: Config = {
  path: '/*',
};
