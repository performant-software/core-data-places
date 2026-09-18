import { loadEnv } from 'vite';

const { STATIC_BUILD } = loadEnv(process.env.STATIC_BUILD, process.cwd(), '');

export const isStaticBuild = STATIC_BUILD === 'true';

const PREVIEW_ROUTE = /\/pages\/.*\/preview\/.*\.astro$/;
const ISLAND_ROUTE = /\/pages\/tina-island\/.*\.ts$/;

/**
 * Routes that only make sense with a server: the editor preview pages and the
 * TinaCMS island endpoint. In a static build they are prerendered with no
 * paths, so they add nothing to the output and the build needs no adapter.
 */
export const isServerOnlyRoute = (file) => PREVIEW_ROUTE.test(file) || ISLAND_ROUTE.test(file);

/**
 * Adds an empty getStaticPaths to a server-only route so Astro can prerender
 * it as a dynamic route with no pages. Astro components get it at the top of
 * the frontmatter; endpoints get it at the top of the file.
 */
export const withEmptyStaticPaths = (code) => {
  if (/export\s+(const|function|async\s+function)\s+getStaticPaths/.test(code)) {
    return code;
  }

  const line = 'export const getStaticPaths = () => [];\n';

  if (/^---\r?\n/.test(code)) {
    return code.replace(/^---\r?\n/, `---\n${line}`);
  }

  return line + code;
};

/**
 * Astro integration for static builds: with STATIC_BUILD=true it prerenders
 * the server-only routes with no paths. It changes nothing otherwise.
 */
export default function staticMode() {
  return {
    name: 'fds-static-mode',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        if (!isStaticBuild) return;

        updateConfig({
          vite: {
            plugins: [{
              name: 'fds-static-mode-routes',
              enforce: 'pre',
              transform(code, id) {
                if (!isServerOnlyRoute(id)) return;

                return { code: withEmptyStaticPaths(code), map: null };
              }
            }]
          }
        });
      },
      'astro:route:setup': ({ route }) => {
        if (!isStaticBuild) return;

        if (isServerOnlyRoute(route.component)) {
          route.prerender = true;
        }
      }
    }
  };
}
