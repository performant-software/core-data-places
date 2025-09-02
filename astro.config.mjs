import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';
import auth from 'auth-astro';
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
      prefixDefaultLocale: true
    }
  },
  output: STATIC_BUILD === 'true' ? 'static' : 'server',
  adapter: netlify(),
  integrations: [mdx(), sitemap(), react(), auth()],
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