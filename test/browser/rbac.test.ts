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

test.use({ baseURL: process.env.TINA_PUBLIC_TINA_BASE_URL || 'http://localhost:8888/admin/'})

test.describe('Tina RBAC restrictions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('index.html');
    await page.locator('[data-test="enter-edit-mode"]').click().catch(() => {});
  });
  
  test('Sidebar access restrictions for non-admin user', async ({ page }) => {
    await page.getByRole('button', { name: 'Open navigation menu' }).click();
    for (const label of VISIBLE_LINKS) {
      const link = page.getByRole('link', { name: label });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href');
    }

    for (const label of ADMIN_ONLY_LINKS) {
      const link = page.locator('a', { hasText: label }).first();
      await expect(link).toHaveAttribute('aria-disabled', 'true');
      await expect(link).not.toHaveAttribute('href');
    }

    await expect(page.getByRole('link', { name: 'Edit History' })).toBeHidden();
  });

  test('Read-only Posts editor for non-admin user', async ({ page }) => {
    test.setTimeout(60_000)
    await page.goto('index.html#/collections/post');
    await page.locator('td a').first().click();

    await expect(
      page.locator(
        `text=You're not the author of this content. You can view but not edit.`
      )
    ).toBeVisible({ timeout: 20_000 });

    await expect(page.locator('body[data-tina-read-only="true"]')).toBeVisible();
  });

  test('Read-only Paths editor for non-admin user', async ({ page }) => {
    test.setTimeout(60_000)
    await page.goto('index.html#/collections/path');
    await page.locator('td a').first().click();

    await expect(
      page.locator(
        `text=You're not the author of this content. You can view but not edit.`
      )
    ).toBeVisible({ timeout: 20_000 });

    await expect(page.locator('body[data-tina-read-only="true"]')).toBeVisible();
  });
});