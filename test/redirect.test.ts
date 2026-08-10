import { beforeEach, describe, expect, it, vi } from 'vitest';

const env: Record<string, string | undefined> = {};

vi.stubGlobal('Netlify', {
  env: {
    get: (name: string) => env[name]
  }
});

const NEXT = 'next';

const context = {
  next: async () => new Response(NEXT)
} as any;

/**
 * The edge function reads its domains once, at module scope, so each case loads a fresh copy.
 */
const loadRedirect = async () => {
  vi.resetModules();

  const { default: redirect } = await import('../netlify/edge-functions/redirect');
  return redirect;
};

const request = (url: string, headers?: HeadersInit) => new Request(url, { headers });

describe('redirect', () => {
  beforeEach(() => {
    env.PUBLIC_DOMAIN = 'example.org';
    env.ADMIN_DOMAIN = 'admin.example.org';
  });

  it('redirects /admin on the canonical public domain to the admin domain', async () => {
    const redirect = await loadRedirect();
    const response = await redirect(request('https://example.org/admin/'), context);

    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://admin.example.org/admin/');
  });

  it('redirects /admin on the other hostnames the site answers on', async () => {
    const redirect = await loadRedirect();

    const custom = await redirect(request('https://www.cimarrongeographies.org/admin/'), context);
    expect(custom.status).toBe(301);
    expect(custom.headers.get('location')).toBe('https://admin.example.org/admin/');

    const alias = await redirect(request('https://marronage-prod.netlify.app/admin/index.html'), context);
    expect(alias.status).toBe(301);
    expect(alias.headers.get('location')).toBe('https://admin.example.org/admin/index.html');
  });

  it('preserves the path and query when redirecting to the admin domain', async () => {
    const redirect = await loadRedirect();
    const response = await redirect(request('https://www.cimarrongeographies.org:443/admin/media?dir=posts'), context);

    expect(response.headers.get('location')).toBe('https://admin.example.org/admin/media?dir=posts');
  });

  it('serves /admin on the admin domain', async () => {
    const redirect = await loadRedirect();
    const response = await redirect(request('https://admin.example.org/admin/'), context);

    expect(await response.text()).toEqual(NEXT);
  });

  it('redirects non-admin paths on the admin domain to the public domain', async () => {
    const redirect = await loadRedirect();
    const response = await redirect(request('https://admin.example.org/en/posts'), context);

    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://example.org/en/posts');
  });

  it('serves non-admin paths on every public hostname', async () => {
    const redirect = await loadRedirect();

    const canonical = await redirect(request('https://example.org/en/posts'), context);
    expect(await canonical.text()).toEqual(NEXT);

    const alias = await redirect(request('https://marronage-prod.netlify.app/en/posts'), context);
    expect(await alias.text()).toEqual(NEXT);
  });

  it('serves /admin from the local development server', async () => {
    const redirect = await loadRedirect();

    const localhost = await redirect(request('http://localhost:8888/admin/'), context);
    expect(await localhost.text()).toEqual(NEXT);

    const loopback = await redirect(request('http://127.0.0.1:8888/admin/'), context);
    expect(await loopback.text()).toEqual(NEXT);
  });

  it('serves everything when the domains are not configured', async () => {
    env.PUBLIC_DOMAIN = undefined;
    env.ADMIN_DOMAIN = undefined;

    const redirect = await loadRedirect();
    const response = await redirect(request('https://www.cimarrongeographies.org/admin/'), context);

    expect(await response.text()).toEqual(NEXT);
  });

  it('serves the ignored paths', async () => {
    const redirect = await loadRedirect();

    for (const path of ['/api/tina', '/api/s3', '/_astro/admin.js']) {
      const response = await redirect(request(`https://www.cimarrongeographies.org${path}`), context);
      expect(await response.text()).toEqual(NEXT);
    }
  });

  it('serves the admin requests made from within the editor', async () => {
    const redirect = await loadRedirect();

    for (const dest of ['iframe', 'empty']) {
      const response = await redirect(
        request('https://www.cimarrongeographies.org/admin/', { 'sec-fetch-dest': dest }),
        context
      );

      expect(await response.text()).toEqual(NEXT);
    }
  });
});
