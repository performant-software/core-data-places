import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import _config from '@config' with { type: 'json' };

dotenv.config();

const locale = _config.i18n.default_locale;
const baseURL = `${process.env.A11Y_HOST}/${locale}/`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: 'test/browser',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['html', { open: 'never' }]
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [{
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      baseURL
    }
  }, {
    name: 'firefox',
    use: {
      ...devices['Desktop Firefox'],
      baseURL
    }
  }, {
    name: 'webkit',
    use: {
      ...devices['Desktop Safari'],
      baseURL
    }
  }]
});
