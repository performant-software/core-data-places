/**
 * FDS dev toolbar app: shows which site and env this dev server is serving,
 * on every page, all session long — with a persistent warning when the env
 * is production-tier (local TinaCMS edits write to production data).
 *
 * Dev-only: the toolbar exists only under `astro dev`, and both hooks below
 * no-op everywhere else. Site identity comes from the state `fds dev` writes
 * (.fds-dev.json), falling back to the Netlify link and injected env vars,
 * so the panel degrades gracefully when the server was started by hand.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Envs where local TinaCMS edits write to production data (mirrors fds dev). */
const PROD_TIER = new Set(['production', 'static']);

const readJson = (path) => {
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
};

const git = (root, args) => {
  try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim(); } catch { return null; }
};

function collectState(root) {
  const fds = readJson(join(root, '.fds-dev.json'));
  const link = readJson(join(root, '.netlify', 'state.json'));
  const branch = git(root, ['rev-parse', '--abbrev-ref', 'HEAD']);
  const sha = git(root, ['rev-parse', '--short', 'HEAD']);
  const env = fds?.env ?? null;
  return {
    project: fds?.project ?? null,
    env,
    prodTier: env !== null && PROD_TIER.has(env),
    mode: fds?.mode ?? null,
    startedAt: fds?.startedAt ?? null,
    siteId: fds?.siteId ?? link?.siteId ?? null,
    publicDomain: process.env.PUBLIC_DOMAIN ?? null,
    ref: sha === null ? null : branch === 'HEAD' ? `detached @ ${sha}` : `${branch} @ ${sha}`,
  };
}

export default function fdsToolbar() {
  let root = process.cwd();
  return {
    name: 'fds-dev-toolbar',
    hooks: {
      'astro:config:setup': ({ addDevToolbarApp, config, command }) => {
        if (command !== 'dev') return;
        root = fileURLToPath(config.root);
        addDevToolbarApp({
          id: 'fds',
          name: 'FairData Site',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
          entrypoint: new URL('./app.mjs', import.meta.url),
        });
      },
      'astro:server:setup': ({ toolbar }) => {
        if (!toolbar) return;
        const send = () => toolbar.send('fds-toolbar:state', collectState(root));
        toolbar.onAppInitialized('fds', send);
        toolbar.on('fds-toolbar:refresh', send);
      },
    },
  };
}
