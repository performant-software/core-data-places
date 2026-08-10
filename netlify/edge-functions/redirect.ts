import type { Config, Context } from '@netlify/edge-functions';

const publicDomain = Netlify.env.get('PUBLIC_DOMAIN');
const adminDomain = Netlify.env.get('ADMIN_DOMAIN');

const secFetchHeaders = [
  'iframe',
  'empty'
]

const ignorePaths = [
  '/api/tina',
  '/api/s3',
  '/_astro'
]

// The development server answers for every site, so it serves /admin itself.
const localHostnames = [
  'localhost',
  '127.0.0.1',
  '[::1]'
]

export default async (request: Request, context: Context) => {
  if (!publicDomain || !adminDomain) {
    return context.next();
  }

  if (secFetchHeaders.includes(request.headers.get('sec-fetch-dest'))) {
    return context.next();
  }

  const url = new URL(request.url);

  if (ignorePaths.some(path => url.pathname.startsWith(path))) {
    return context.next();
  }

  const admin = url.pathname.startsWith('/admin');

  if (url.hostname === adminDomain) {
    if (!admin) {
      url.hostname = publicDomain;
      return Response.redirect(url.toString(), 301);
    }

    return context.next();
  }

  if (admin && !localHostnames.includes(url.hostname)) {
    url.hostname = adminDomain;
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
};

export const config: Config = {
  path: '/*',
};
