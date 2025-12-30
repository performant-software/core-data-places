import AxeBuilder from '@axe-core/playwright';
import { fetchPages, fetchPaths, fetchPosts } from '@backend/tina';
import _config from '@config' with { type: 'json' };
import { expect, Page, test } from '@playwright/test';
import { getService } from './helpers';

const baseUrl = process.env.A11Y_HOST;
const isStaticBuild = process.env.STATIC_BUILD === 'true';

const locale = _config.i18n.default_locale;

const includePosts = _config.content?.collections?.includes('posts');
const includePaths = _config.content?.collections?.includes('paths');

// We'll check only a few records for detail page accessibility
const DETAIL_PAGE_LIMIT = 1;

test.describe('Accessibility testing', () => {
  test.skip(!baseUrl);

  // Home page
  test('Home page should have no violations', async ({ page }) => checkPage(page));

  // Posts
  test.describe('Posts', () => {
    test.skip(!includePosts, 'Posts content not included in this site');

    test('Posts page should have no violations', async ({ page }) => checkPage(page, 'posts'));

    test('Post detail pages should have no violations', async ({ page }) => {
      const posts = await fetchPosts();

      for (const post of posts) {
        await checkPage(page, `posts/${post._sys.filename}`);
      }
    });
  });

  // Paths
  test.describe('Paths', () => {
    test.skip(!includePaths, 'Path content not included in this site');

    test('Paths page should have no violations', async ({ page }) => checkPage(page, 'paths'));

    test('Path detail pages should have no violations', async ({ page }) => {
      const paths = await fetchPaths();

      for (const path of paths) {
        await checkPage(page, `posts/${path._sys.filename}`);
      }
    });
  });

  // Pages
  test.describe('Pages', () => {
    test('Pages should have no violations', async ({ page: p }) => {
      const pages = await fetchPages(locale);

      for (const page of pages) {
        if (!page.home_page) {
          await checkPage(p, `pages/${page._sys.filename}`);
        }
      }
    });
  });

  // Search
  test.describe('Search', () => {
    const searches = _config.search || [];

    searches.forEach((search) => {
      test.describe(`${search.name} should have no violations`, () => {
        test('initial page load', async ({ page }) => checkPage(page, `search/${search.name}`));
        // TODO: Add more tests here for detail panels, filters, etc
      });
    });
  });

  // Sessions
  test.describe('Sessions', () => {
    test.skip(isStaticBuild, 'Sessions not available in static mode');

    test('Sessions should have no violations', async ({ page }) => checkPage(page, 'sessions/search'));

    // TODO: Add more tests
  });

  // Gallery
  test.describe('Gallery', () => {
    test.skip(!_config.gallery, 'Gallery URL not provided.');

    test('Gallery should have no violations', async ({ page }) => checkPage(page, 'gallery'));

    // TODO: Add more tests
  });

  // Detail pages
  test.describe('Detail pages', () => {
    test.skip(!_config.detail_pages?.models, 'No detail pages configured.');

    const { models } = _config.detail_pages;

    models.forEach((name) => {
      test(`${name} should have no violations`, async ({ page }) => {
        const { url: baseUrl, project_ids: projectIds } = _config.core_data;
        const service = getService(name, baseUrl, projectIds);

        const response = await service.fetchAll({ per_page: DETAIL_PAGE_LIMIT });
        const records = response[name];

        for (const record of records) {
          await checkPage(page, `${name}/${record.uuid}`);
        }
      });
    });
  });
});

/**
 * Checks the passed path for accessibility violations.
 *
 * @param page
 * @param path
 */
const checkPage = async (page: Page, path: string = '') => {
  const url = `${baseUrl}/${locale}/${path}`;
  await page.goto(url);

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations, path).toEqual([]);
};