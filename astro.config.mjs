import { defineConfig } from 'astro/config';
import netlify from "@astrojs/netlify";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import config from "./src/i18n/config";
import paraglide from '@inlang/paraglide-astro';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  i18n: config.i18n,
  output: "server",
  adapter: netlify(),
  integrations: [mdx(), tailwind(), sitemap(), react(), paraglide({
    // recommended settings
    project: "./project.inlang",
    outdir: "./src/paraglide", //where your files should be
  })],
  vite: {
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