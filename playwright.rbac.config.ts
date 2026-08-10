import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_BASE_URL = 'http://localhost:8888/admin/';
const baseURL = process.env.RBAC_BASE_URL || DEFAULT_BASE_URL;

// A remote RBAC_BASE_URL is tested as-is; only a local admin needs servers.
const isLocalAdmin = new URL(baseURL).hostname === 'localhost';

// astro runs directly; nesting it inside `netlify dev` breaks its startup.
// netlify then runs proxy-only in front, supplying the edge-function runtime.
const astroCommand = 'npm start';
const netlifyProxyCommand =
  'netlify dev --offline -c "tail -f /dev/null" --target-port 4321';

// Separate config from the a11y suite because webServer is per-config, not
// per-project. See https://playwright.dev/docs/test-webserver.
export default defineConfig({
  testDir: 'test/browser',
  testMatch: /rbac\.test\.ts/,

  // Serial: all tests share one stateful dev server.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 2,
  // Generous: the warmup hook absorbs a slow one-time vite compile.
  timeout: 240_000,

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  projects: [{
    name: 'rbac',
    use: {
      ...devices['Desktop Chrome']
    }
  }],

  // Playwright starts both and waits for both; netlify's --target-port wait
  // bridges the gap until astro binds 4321.
  webServer: isLocalAdmin ? [
    {
      command: astroCommand,
      // Astro alone 500s every route (edge function needs netlify), so wait on
      // the TCP port, not a URL health check.
      port: 4321,
      // Always fresh — TINA_PUBLIC_* is inlined, so a reused server could skew results.
      reuseExistingServer: false,
      timeout: 300_000,
      stdout: 'pipe',
      stderr: 'pipe',

      // Hardcoded, not process.env fallbacks: these must override a developer's
      // .env that dotenv loaded above.
      env: {
        // Stop astro auto-daemonizing when it detects an agent shell (CLAUDECODE).
        ASTRO_DEV_BACKGROUND: '1',

        // Dev-role override in tina/utils/getUserRole.ts (needs IS_LOCAL=true).
        TINA_PUBLIC_IS_LOCAL: 'true',
        TINA_PUBLIC_DEV_ROLE: 'org:member',
        TINA_PUBLIC_DEV_USER_ID: 'dev-user',

        // Serve the committed fixtures instead of any real content repo.
        TINA_LOCAL_CONTENT_PATH: '../test/fixtures/',
        CONFIG_URL: '',
        CONFIG_FILE: 'test/fixtures/content/settings/config.json'
      }
    },
    {
      // Proxy-only on 8888 → astro on 4321; the -c no-op stops netlify spawning
      // its own framework (an empty -c "" is rejected by some CLI versions).
      command: netlifyProxyCommand,
      // Serves 200 only once astro is up behind it — the real readiness gate.
      url: new URL('index.html', baseURL).toString(),
      reuseExistingServer: false,
      timeout: 120_000,
      stdout: 'pipe',
      stderr: 'pipe',
      env: {
        TINA_PUBLIC_IS_LOCAL: 'true'
      }
    }
  ] : undefined
});
