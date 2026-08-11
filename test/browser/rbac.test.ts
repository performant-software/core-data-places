import { expect, test } from '@playwright/test';

const ADMIN_ONLY_LINKS = [
  'Settings',
  'Branding',
  'Internationalization',
  'Navbar',
  'Pages',
  'Edit History Dashboard'
];

const VISIBLE_LINKS = ['Posts', 'Paths'];

const RBAC_BASE = process.env.RBAC_BASE_URL || 'http://localhost:8888/admin/';
const isLocalAdmin = new URL(RBAC_BASE).hostname === 'localhost';

// Dismiss TinaCMS's "Enter into edit mode" gate; no-op if already past it.
const enterEditMode = async (page) => {
  await page
    .getByRole('button', { name: 'Enter Edit Mode' })
    .click({ timeout: 20_000 })
    .catch(() => {});
};

// Open a collection's first document and wait for its preview page to load.
const warmEditor = async (page, collection) => {
  await page.goto(new URL(`index.html#/collections/${collection}`, RBAC_BASE).toString());
  await enterEditMode(page);
  const previewLoaded = page
    .waitForResponse((r) => r.url().includes('/preview/') && r.ok(), { timeout: 200_000 })
    .catch(() => {});
  await page.locator('td a').first().click();
  await previewLoaded;
};

// Runs against test/fixtures/content (see playwright.rbac.config.ts): one post
// and one path, each owned by a different user than TINA_PUBLIC_DEV_USER_ID.
test.describe('Tina RBAC restrictions', () => {
  // Warm both preview routes once (their on-demand compile can take minutes) so
  // the tests run against a warm server. Skipped for a prebuilt remote admin.
  test.beforeAll(async ({ browser }) => {
    if (!isLocalAdmin) return;
    test.setTimeout(420_000);
    const page = await browser.newPage();
    try {
      for (const collection of ['post', 'path']) {
        await warmEditor(page, collection);
      }
    } finally {
      await page.close();
    }
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('index.html');
  });

  test('Sidebar access restrictions for non-admin user', async ({ page }) => {
    await page.getByRole('button', { name: 'Open navigation menu' }).click();

    for (const label of VISIBLE_LINKS) {
      const link = page.getByRole('link', { name: label, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href');
    }

    for (const label of ADMIN_ONLY_LINKS) {
      const link = page.locator('a', { hasText: label }).first();
      await expect(link).toHaveAttribute('aria-disabled', 'true');
      await expect(link).not.toHaveAttribute('href');
    }

    // exact: don't also match 'Edit History Dashboard'.
    await expect(page.getByText('Edit History', { exact: true })).toBeHidden();
  });

  test('Read-only Posts editor for non-admin user', async ({ page }) => {
    await page.goto('index.html#/collections/post');
    await enterEditMode(page);
    await page.locator('td a').first().click();

    await expect(
      page.getByText(`You're not the author of this content. You can view but not edit.`)
    ).toBeVisible({ timeout: 60_000 });

    await expect(page.locator('body')).toHaveAttribute('data-tina-read-only', 'true');
  });

  test('Read-only Paths editor for non-admin user', async ({ page }) => {
    await page.goto('index.html#/collections/path');
    await enterEditMode(page);
    await page.locator('td a').first().click();

    await expect(
      page.getByText(`You're not the author of this content. You can view but not edit.`)
    ).toBeVisible({ timeout: 60_000 });

    await expect(page.locator('body')).toHaveAttribute('data-tina-read-only', 'true');
  });
});
