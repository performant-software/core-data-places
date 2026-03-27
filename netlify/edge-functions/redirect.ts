import type { Config, Context } from '@netlify/edge-functions';

const publicDomain = Netlify.env.get('PUBLIC_DOMAIN');
const adminDomain = Netlify.env.get('ADMIN_DOMAIN');

const secFetchHeaders = [
  'iframe',
  'empty'
]

const adminPaths = [
  '/admin',
  '/api/tina'
]

export default async (request: Request, context: Context) => {
  if (!publicDomain || !adminDomain) {
    return context.next();
  }

  if (secFetchHeaders.includes(request.headers.get('sec-fetch-dest'))) {
    return context.next();
  }

  const url = new URL(request.url);

  if (url.hostname === publicDomain && adminPaths.some((path) => url.pathname.startsWith(path))) {
    url.hostname = adminDomain;
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }

  if (url.hostname === adminDomain && !adminPaths.some(path => url.pathname.startsWith(path))) {
    url.hostname = publicDomain;
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
};

export const config: Config = {
  path: '/*',
};
