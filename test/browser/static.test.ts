import { test, expect } from '@playwright/test';
import config from '../../public/config.json' with { type: 'json' };

/**
 * Portability check for a published static site: its pages must render with
 * no request to any of the site's own backend hosts, must make no server-
 * island request, and every same-origin asset they ask for must exist. The
 * search page is allowed to call the search host until the static search
 * adapter lands.
 *
 * STATIC_SITE_URL names the site to check (a local server or the published
 * one). Own hosts are every hostname found in config.json; STATIC_OWN_HOSTS
 * adds more, comma-separated. STATIC_DETAIL_PATH adds one detail page.
 */
const BASE = process.env.STATIC_SITE_URL;
const locale: string = (config as any).i18n.default_locale;

const hostnames = (value: unknown, found: Set<string>, key = ''): Set<string> => {
  if (typeof value === 'string') {
    try { found.add(new URL(value).hostname); } catch { if (key === 'host') found.add(value); }
  } else if (Array.isArray(value)) {
    value.forEach((v) => hostnames(v, found));
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => hostnames(v, found, k));
  }

  return found;
};

const OWN_HOSTS = [...hostnames(config, new Set<string>()), ...(process.env.STATIC_OWN_HOSTS ?? '').split(',')]
  .map((h) => h.trim())
  .filter(Boolean);

const searchHost: string = Array.isArray((config as any).search) ? ((config as any).search[0]?.typesense?.host ?? '') : '';
const searchName = Array.isArray((config as any).search) ? (config as any).search[0]?.name : undefined;

const PAGES: Array<{ name: string; path: string; searchAllowed?: boolean }> = [
  { name: 'home', path: `/${locale}` },
  { name: 'posts list', path: `/${locale}/posts` },
  ...(searchName ? [{ name: `search (${searchName})`, path: `/${locale}/search/${searchName}`, searchAllowed: true }] : []),
  ...(process.env.STATIC_DETAIL_PATH ? [{ name: 'detail', path: process.env.STATIC_DETAIL_PATH }] : [])
];

test.describe('static site portability', () => {
  test.skip(!BASE, 'STATIC_SITE_URL is not set');

  for (const page of PAGES) {
    test(`${page.name}: renders with no own-backend or server-island requests`, async ({ page: pw }) => {
      const ownCalls: string[] = [];
      const islandCalls: string[] = [];
      const failedSameOrigin: string[] = [];
      const origin = new URL(BASE!).origin;

      pw.on('request', (req) => {
        const url = new URL(req.url());
        if (url.origin === origin) return;
        if (OWN_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith('.' + h))) ownCalls.push(req.url());
        if (url.pathname.startsWith('/_server-islands')) islandCalls.push(req.url());
      });
      pw.on('response', (res) => {
        const url = new URL(res.url());
        if (url.origin !== origin) return;
        if (url.pathname.startsWith('/_server-islands')) islandCalls.push(res.url());
        if (res.status() >= 400 && url.pathname !== '/favicon.ico') failedSameOrigin.push(`${res.status()} ${res.url()}`);
      });

      await pw.goto(BASE + page.path, { waitUntil: 'networkidle', timeout: 45_000 });

      const unexpectedOwnCalls = page.searchAllowed && searchHost
        ? ownCalls.filter((u) => !new URL(u).hostname.endsWith(searchHost))
        : ownCalls;

      expect.soft(unexpectedOwnCalls, `own-backend requests from ${page.path}`).toEqual([]);
      expect.soft(islandCalls, `server-island requests from ${page.path}`).toEqual([]);
      expect.soft(failedSameOrigin, `failed same-origin requests from ${page.path}`).toEqual([]);
      await expect.soft(pw.locator('body')).not.toBeEmpty();
    });
  }
});
