import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import config from './public/config.json';

import auth from 'auth-astro';

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
  integrations: [mdx(), tailwind(), sitemap(), react(), auth()],
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
  }
});