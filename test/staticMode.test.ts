import { describe, expect, test } from 'vitest';
import { isServerOnlyRoute, withEmptyStaticPaths } from '../integrations/static-mode.mjs';

describe('isServerOnlyRoute', () => {
  test('matches the preview routes and the island endpoint, nothing else', () => {
    expect(isServerOnlyRoute('/x/src/pages/[lang]/pages/preview/[slug].astro')).toBe(true);
    expect(isServerOnlyRoute('/x/src/pages/[lang]/posts/[hash]/preview/[slug].astro')).toBe(true);
    expect(isServerOnlyRoute('/x/src/pages/[lang]/paths/[hash]/preview/[slug].astro')).toBe(true);
    expect(isServerOnlyRoute('/x/src/pages/tina-island/[name].ts')).toBe(true);
    expect(isServerOnlyRoute('/x/src/pages/[lang]/posts/[slug].astro')).toBe(false);
    expect(isServerOnlyRoute('/x/src/pages/api/[model]/[uuid]/index.json.ts')).toBe(false);
    expect(isServerOnlyRoute('/x/src/apps/pages/Page.astro')).toBe(false);
  });
});

describe('withEmptyStaticPaths', () => {
  test('adds an empty getStaticPaths at the top of an Astro frontmatter', () => {
    const out = withEmptyStaticPaths('---\nimport X from "x";\nexport const prerender = false;\n---\n<X />');

    expect(out.startsWith('---\nexport const getStaticPaths = () => [];\nimport X')).toBe(true);
  });

  test('adds it at the top of an endpoint file', () => {
    const out = withEmptyStaticPaths('import type { APIRoute } from "astro";\nexport const prerender = false;\n');

    expect(out.startsWith('export const getStaticPaths = () => [];\nimport type')).toBe(true);
  });

  test('leaves a route that already exports getStaticPaths alone', () => {
    const src = '---\nexport async function getStaticPaths() { return []; }\n---\n';

    expect(withEmptyStaticPaths(src)).toBe(src);
  });
});
