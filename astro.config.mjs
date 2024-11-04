import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import config from './config.json';

// https://astro.build/config
export default defineConfig({
  i18n: {
    ...config.i18n,
    routing: {
      prefixDefaultLocale: true
    }
  },
  output: 'server',
  adapter: netlify(),
  integrations: [
    mdx(),
    tailwind(),
    sitemap(),
    react()
  ],
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