import { test, expect } from '@playwright/test';

/**
 * PoC portability spec (static-build design §6, the regression suite's core
 * assertion): pages on the deployed static site must render their content
 * with NO network requests to the site's own backend hosts — and the
 * bundled assets they DO request must actually resolve (a failed pmtiles://
 * fetch or a 404 image never touches an own-backend host, so absence of
 * leaks alone let a broken map pass).
 *
 * Expected today: every archetype passes except search, which still calls
 * Typesense (the funded search-spike's territory, deliberately unconverted).
 */

const BASE = process.env.POC_BASE_URL ?? 'https://poc.fairdata.site';

const OWN_HOSTS = [
  'staging.coredata.cloud',
  'i74olkjcuy69ze2vp-1.a1.typesense.net',
  'staging.iiifcloud.com',
  'core-data-tina-cms.s3.us-east-1.amazonaws.com',
  'iiif-cloud-staging.herokuapp.com',
];

// slug → path, a text the page must render, and whether it must paint the
// self-hosted basemap (at least one successful basemap.pmtiles range read).
const PAGES: Array<{ name: string; path: string; mustShow: RegExp; expectMap?: boolean }> = [
  { name: 'home', path: '/en', mustShow: /scavenger|hunt|explore/i },
  { name: 'detail (place)', path: '/en/places/004b20ec-a471-430b-ad29-f9525879ef4d', mustShow: /Kenmore/, expectMap: true },
  { name: 'path', path: '/en/paths/Dead-Media-Tour', mustShow: /Dead Media/i, expectMap: true },
  { name: 'posts list', path: '/en/posts', mustShow: /blog|post/i },
  { name: 'search (places)', path: '/en/search/places', mustShow: /result|filter|search/i, expectMap: true },
];

for (const page of PAGES) {
  test(`${page.name}: renders content with no own-backend calls`, async ({ page: pw }) => {
    const ownCalls: string[] = [];
    const islandCalls: string[] = [];
    const failedOwnOrigin: string[] = [];
    let basemapReads = 0;

    pw.on('request', (req) => {
      const url = new URL(req.url());
      if (OWN_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith('.' + h))) ownCalls.push(req.url());
      if (url.pathname.startsWith('/_server-islands')) islandCalls.push(req.url());
    });
    pw.on('response', (res) => {
      const url = new URL(res.url());
      if (url.origin !== new URL(BASE).origin) return;
      // Any 4xx/5xx from the site's own origin is a broken bundled asset
      // (missing image, missing tile) — the positive case failing quietly.
      if (res.status() >= 400 && url.pathname !== '/favicon.ico') failedOwnOrigin.push(`${res.status()} ${res.url()}`);
      if (url.pathname.endsWith('/basemap.pmtiles') && res.status() < 300) basemapReads += 1;
    });

    await pw.goto(BASE + page.path, { waitUntil: 'networkidle', timeout: 45_000 });

    expect.soft(ownCalls, `own-backend requests from ${page.path}`).toEqual([]);
    expect.soft(islandCalls, `server-island fetches from ${page.path} (404 on a static host)`).toEqual([]);
    expect.soft(failedOwnOrigin, `failed same-origin asset requests from ${page.path}`).toEqual([]);
    if (page.expectMap) {
      expect.soft(basemapReads, `successful basemap.pmtiles reads from ${page.path} (pmtiles protocol + range requests)`).toBeGreaterThan(0);
    }
    await expect.soft(pw.locator('body')).toContainText(page.mustShow, { timeout: 10_000 });
  });
}
