import { readFile } from 'node:fs/promises';

/**
 * Astro cannot build server islands without an adapter, and a static build has
 * no server to render them later. In static mode every island's data is
 * already available at build time, so the directive is dropped before the
 * component compiles and the island renders into the page like any other
 * component. Server-rendered sites keep deferring.
 *
 * Astro compiles components in its own pre-ordered transform, which runs
 * before any integration's transform, so the directive has to be removed
 * when the file is loaded, one step earlier.
 */
const SERVER_DEFER = /\s+server:defer(?=[\s/>])/g;

export const withoutServerIslands = (code) => code.replace(SERVER_DEFER, '');

const isComponentFile = (id) => id.endsWith('.astro');

export default function staticIslands() {
  return {
    name: 'fds-static-islands',
    enforce: 'pre',
    async load(id) {
      if (!isComponentFile(id)) return;

      const code = await readFile(id, 'utf8');

      if (!code.includes('server:defer')) return;

      return { code: withoutServerIslands(code), map: null };
    }
  };
}
