import AxeBuilder from '@axe-core/playwright';
import { fetchPages, fetchPaths, fetchPosts } from '@backend/tina';
import _config from '@config' with { type: 'json' };
import { expect, Page, test } from '@playwright/test';
import { getService } from './helpers';

const isStaticBuild = process.env.STATIC_BUILD === 'true';

const locale = _config.i18n.default_locale;

const includePosts = _config.content?.collections?.includes('posts');
const includePaths = _config.content?.collections?.includes('paths');

const SEARCH_TYPE_MAP = 'map';

// We'll check only a few records for detail page accessibility
const DETAIL_PAGE_LIMIT = 1;
const DEFAULT_SEARCH_TYPE = SEARCH_TYPE_MAP;

test.describe('Accessibility testing', () => {
  // Home page
  test('Home page should have no violations', async ({ page }) => {
    await page.goto('');
    await checkPage(page);
  });

  // Posts
  test.describe('Posts', () => {
    test.skip(!includePosts, 'Posts content not included in this site');

    test('Posts page should have no violations', async ({ page }) => {
      await page.goto('posts');
      await checkPage(page);
    });

    test('Post detail pages should have no violations', async ({ page }) => {
      const { posts } = await fetchPosts();

      for (const post of posts) {
        await page.goto(`posts/${post._sys.filename}`);
        await checkPage(page);
      }
    });
  });

  // Paths
  test.describe('Paths', () => {
    test.skip(!includePaths, 'Path content not included in this site');

    test('Paths page should have no violations', async ({ page }) => {
      await page.goto('paths');
      await checkPage(page);
    });

    test('Path detail pages should have no violations', async ({ page }) => {
      const paths = await fetchPaths();

      for (const path of paths) {
        await page.goto(`posts/${path._sys.filename}`);
        await checkPage(page);
      }
    });
  });

  // Pages
  test.describe('Pages', () => {
    test('Pages should have no violations', async ({ page: p }) => {
      const pages = await fetchPages(locale);

      for (const page of pages) {
        if (!page.home_page) {
          await p.goto(`pages/${page._sys.filename}`);
          await checkPage(p);
        }
      }
    });
  });

  // Search
  test.describe('Search', () => {
    const searches = _config.search || [];

    searches.forEach((search) => {
      const { name, type = DEFAULT_SEARCH_TYPE } = search;

      test.describe(`${name} search`, () => {
        // Initial page load
        test('initial page load should have no violations', async ({ page }) => {
          await page.goto(`search/${name}`);
          await checkPage(page);
        });

        const isMapSearch = type === SEARCH_TYPE_MAP;

        // Table view
        test('table view should have no violations', async ({ page }) => {
          test.skip(!isMapSearch, 'Table view only in map search.');

          await page.goto(`search/${name}`);

          await page
            .getByRole('button', { name: 'Table' })
            .click();

          await checkPage(page);
        });

        // Filters panel
        test('filters panel should have no violations', async ({ page }) => {
          test.skip(!isMapSearch, 'Filters only in map search.');

          await page.goto(`search/${name}`);

          await page
            .getByRole('button', { name: 'Filters' })
            .click();

          await checkPage(page);
        });

        // Detail panel
        test('detail panel should have no violations', async ({ page }) => {
          test.skip(!isMapSearch, 'Detail panel only in map search.');

          await page.goto(`search/${name}`);

          await page
            .getByRole('button')
            .filter({ has: page.locator('.ais-Highlight') })
            .first()
            .click();

          await checkPage(page);
        });
      });
    });
  });

  // Sessions
  test.describe('Sessions', () => {
    test.skip(isStaticBuild, 'Sessions not available in static mode');

    test('Sessions should have no violations', async ({ page }) => {
      await page.goto('sessions/search');
      await checkPage(page);
    });
  });

  // Gallery
  test.describe('Gallery', () => {
    test.skip(!_config.gallery, 'Gallery URL not provided.');

    test('Gallery should have no violations', async ({ page }) => {
      await page.goto('gallery');
      await checkPage(page);
    });

    test('Gallery item should have no violations', async ({ page }) => {
      await page.goto('gallery');

      await page
        .getByRole('button')
        .filter({ has: page.locator('img') })
        .first()
        .click();

      await checkPage(page);
    });
  });

  // Detail pages
  test.describe('Detail pages', () => {
    test.skip(!_config.detail_pages, 'No detail pages configured.');

    const models = Object.keys(_config.detail_pages.models);

    models.forEach((name) => {
      test(`${name} should have no violations`, async ({ page }) => {
        const { url: baseUrl, project_ids: projectIds } = _config.core_data;
        const service = getService(name, baseUrl, projectIds);

        const response = await service.fetchAll({ per_page: DETAIL_PAGE_LIMIT });
        const records = response[name];

        for (const record of records) {
          await page.goto(`${name}/${record.uuid}`);
          await  checkPage(page);
        }
      });
    });
  });
});

/**
 * Checks the passed path for accessibility violations.
 *
 * @param page
 * @param message
 */
const checkPage = async (page: Page, message: string = '') => {
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations, message || page.url()).toEqual([]);
};