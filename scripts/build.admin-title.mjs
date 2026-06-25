/**
 * Personalize the TinaCMS admin browser-tab title per deployment.
 *
 * The admin is rebranded to FairData via patch-package (see tina/branding/),
 * but the tab title should read "<Project Name> FairData Site" — singular,
 * naming the specific site this deployment serves. The project name is the
 * Branding collection's `title` (the same value the public site uses), which
 * is only known per-deployment, so it can't live in a static patch.
 *
 * This runs after `tinacms build` (which emits public/admin/index.html) and
 * before `astro build` (which copies public/ into dist/). It reads the cloned
 * branding content and rewrites the admin <title>. If anything is missing it
 * leaves the existing title (the patched "FairData" fallback) untouched.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ADMIN_HTML = path.resolve('public/admin/index.html');
const BRANDING_JSON = path.resolve('content/branding/branding.json');

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function main() {
  if (!existsSync(ADMIN_HTML)) {
    console.log('[admin-title] public/admin/index.html not found — skipping (did tinacms build run?)');
    return;
  }

  let projectName;
  try {
    const branding = JSON.parse(await readFile(BRANDING_JSON, 'utf8'));
    projectName = typeof branding.title === 'string' ? branding.title.trim() : '';
  } catch {
    console.log('[admin-title] no branding.json title — leaving the fallback title in place');
    return;
  }
  if (!projectName) {
    console.log('[admin-title] empty branding title — leaving the fallback title in place');
    return;
  }

  const title = `${escapeHtml(projectName)} FairData Site`;
  const html = await readFile(ADMIN_HTML, 'utf8');
  if (!/<title>[\s\S]*?<\/title>/.test(html)) {
    console.log('[admin-title] no <title> tag in admin HTML — skipping');
    return;
  }
  const next = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  await writeFile(ADMIN_HTML, next);
  console.log(`[admin-title] set admin tab title to "${title}"`);
}

main().catch((err) => {
  // Non-fatal: a wrong tab title shouldn't fail a deploy.
  console.warn('[admin-title] skipped due to error:', err.message);
});
