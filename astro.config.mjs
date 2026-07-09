import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';
import { loadEnv } from 'vite';
import config from './public/config.json';

const { locales, default_locale: defaultLocale } = config.i18n;
const { STATIC_BUILD } = loadEnv(process.env.STATIC_BUILD, process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale,
    locales,
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true
    }
  },
  output: STATIC_BUILD === 'true' ? 'static' : 'server',
  // PoC (poc/static-build): no adapter in static mode, so no SSR function is
  // emitted alongside the static output.
  ...(STATIC_BUILD === 'true' ? {} : { adapter: netlify() }),
  integrations: [mdx(), sitemap(), react()],
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
      },
      ssr: {
        noExternal: ['clsx', '@phosphor-icons/*', '@radix-ui/*']
      }
    },
    plugins: [tailwindcss()],
    resolve: {
      preserveSymlinks: true,
      mainFields: [
        'browser',
        'module',
        'main',
        'jsnext:main',
        'jsnext'
      ]
    }
  },
  env: {
    schema: {
      DISABLE_CACHE: envField.boolean({
        access: 'public',
        context: 'client',
        default: false,
        optional: true
      }),
      CONTENT_MODE: envField.string({
        access: 'public',
        context: 'client',
        default: 'update',
        optional: true
      }),
      PRELOAD_MAP: envField.boolean({
        access: 'public',
        context: 'client',
        default: false,
        optional: true
      }),
      STATIC_BUILD: envField.boolean({
        access: 'public',
        context: 'client',
        default: false,
        optional: true
      }),
      USE_CONTENT_CACHE: envField.boolean({
        access: 'public',
        context: 'client',
        default: false,
        optional: true
      })
    }
  }
});