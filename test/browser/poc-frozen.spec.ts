import { test, expect } from '@playwright/test';

/**
 * PoC portability spec (static-build design §6, the regression suite's core
 * assertion): pages on the deployed static site must render their content
 * with NO network requests to the site's own backend hosts.
 *
 * Round 2 (islands converted, media bundled): home, detail, path, and the
 * posts list are expected to PASS all three assertions. The one documented
 * failure left is search — the search subsystem still calls Typesense (the
 * funded search-spike's territory, deliberately unconverted).
 */

const BASE = process.env.POC_BASE_URL ?? 'https://poc.fairdata.site';

const OWN_HOSTS = [
  'staging.coredata.cloud',
  'i74olkjcuy69ze2vp-1.a1.typesense.net',
  'staging.iiifcloud.com',
  'core-data-tina-cms.s3.us-east-1.amazonaws.com',
  'iiif-cloud-staging.herokuapp.com',
];

// slug → [path, a text the page must render for the archetype to count as alive]
const PAGES: Array<{ name: string; path: string; mustShow: RegExp }> = [
  { name: 'home', path: '/en', mustShow: /scavenger|hunt|explore/i },
  { name: 'detail (place)', path: '/en/places/004b20ec-a471-430b-ad29-f9525879ef4d', mustShow: /Kenmore/ },
  { name: 'path', path: '/en/paths/Dead-Media-Tour', mustShow: /Dead Media/i },
  { name: 'posts list', path: '/en/posts', mustShow: /blog|post/i },
  { name: 'search (places)', path: '/en/search/places', mustShow: /result|filter|search/i },
];

for (const page of PAGES) {
  test(`${page.name}: renders content with no own-backend calls`, async ({ page: pw }) => {
    const ownCalls: string[] = [];
    const islandCalls: string[] = [];
    pw.on('request', (req) => {
      const url = new URL(req.url());
      if (OWN_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith('.' + h))) ownCalls.push(req.url());
      if (url.pathname.startsWith('/_server-islands')) islandCalls.push(req.url());
    });

    await pw.goto(BASE + page.path, { waitUntil: 'networkidle', timeout: 45_000 });

    expect.soft(ownCalls, `own-backend requests from ${page.path}`).toEqual([]);
    expect.soft(islandCalls, `server-island fetches from ${page.path} (404 on a static host)`).toEqual([]);
    await expect.soft(pw.locator('body')).toContainText(page.mustShow, { timeout: 10_000 });
  });
}
