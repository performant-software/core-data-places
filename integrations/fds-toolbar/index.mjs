/**
 * FDS dev toolbar app: shows which site and env this dev server is serving,
 * on every page, all session long — with a persistent warning when the env
 * is production-tier (local TinaCMS edits write to production data).
 *
 * Dev-only: the toolbar exists only under `astro dev` (never in builds,
 * static or SSR), and both hooks below no-op everywhere else. Site identity
 * comes from the state `fds dev` writes (.fds-dev.json), falling back to the
 * Netlify link and injected env vars; FAIR endpoints come from the site's
 * own config.json and env, so the panel degrades gracefully when the server
 * was started by hand.
 */
import { spawn, execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Envs where local TinaCMS edits write to production data (mirrors fds dev). */
const PROD_TIER = new Set(['production', 'static']);

const readJson = (path) => {
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return null; }
};

const git = (root, args) => {
  try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim(); } catch { return null; }
};

const originOf = (url) => {
  try { return new URL(url).origin; } catch { return null; }
};

/** The pstudio workspace ledger: which folders serve which site, on which
 *  ports. Lets the toolbar name this workspace and link to the others. */
function readWorkspaces() {
  const ledger = readJson(join(homedir(), '.config', 'pstudio', 'workspaces.json'));
  return Array.isArray(ledger?.workspaces) ? ledger.workspaces : [];
}

const pidAlive = (pid) => {
  try { process.kill(pid, 0); return true; } catch { return false; }
};

function collectState(root) {
  const fds = readJson(join(root, '.fds-dev.json'));
  const link = readJson(join(root, '.netlify', 'state.json'));
  const config = readJson(join(root, 'public', 'config.json'));
  const branch = git(root, ['rev-parse', '--abbrev-ref', 'HEAD']);
  const sha = git(root, ['rev-parse', '--short', 'HEAD']);
  const env = fds?.env ?? null;
  const { GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, ADMIN_DOMAIN, PUBLIC_DOMAIN, STATIC_BUILD, CONFIG_URL } = process.env;
  return {
    project: fds?.project ?? null,
    env,
    prodTier: env !== null && PROD_TIER.has(env),
    mode: fds?.mode ?? null,
    startedAt: fds?.startedAt ?? null,
    siteId: fds?.siteId ?? link?.siteId ?? null,
    output: STATIC_BUILD === 'true' ? 'static' : 'server',
    ref: sha === null ? null : branch === 'HEAD' ? `detached @ ${sha}` : `${branch} @ ${sha}`,
    content: GITHUB_OWNER && GITHUB_REPO
      ? { repo: `${GITHUB_OWNER}/${GITHUB_REPO}`, branch: GITHUB_BRANCH ?? null }
      : null,
    // FAIR endpoints, as the site itself knows them.
    fairData: config?.core_data?.url ?? originOf(CONFIG_URL),
    fairDataProjects: config?.core_data?.project_ids ?? [],
    publicDomain: PUBLIC_DOMAIN ?? null,
    adminDomain: ADMIN_DOMAIN ?? null,
    version: versionOf(root),
    workspace: workspaceState(root),
    contentClone: contentCloneState(root),
    datalayer: {
      port: Number(process.env.TINA_DATALAYER_PORT ?? 9000),
      isolated: Boolean(process.env.TINA_DATALAYER_PORT),
    },
  };
}

/** Nearest version tag plus short commit — what `fds dev status` shows. */
function versionOf(root) {
  const sha = git(root, ['rev-parse', '--short=8', 'HEAD']);
  if (sha === null) return null;
  const tag = git(root, ['tag', '--sort=-v:refname', '--merged', 'HEAD'])?.split('\n')[0] ?? '';
  return tag ? `${tag} @ ${sha}` : sha;
}

/** This folder's workspace record and the other workspaces on the machine,
 *  each with its URL and whether its dev server is running right now. */
function workspaceState(root) {
  const workspaces = readWorkspaces();
  const mine = workspaces.find((w) => w.sitePath === root) ?? null;
  const others = workspaces
    .filter((w) => w.sitePath !== root)
    .map((w) => ({
      slug: w.slug,
      url: `http://localhost:${w.ports.netlify}`,
      running: pidAlive(readJson(join(w.sitePath, '.fds-dev.json'))?.pid ?? -1),
    }));
  return { home: mine ? dirname(mine.sitePath) : null, slug: mine?.slug ?? null, others };
}

/** The content clone Tina writes to, and how many files an editing session
 *  has changed there — pushing those is publishing. */
function contentCloneState(root) {
  const workspaces = readWorkspaces();
  const fromLedger = workspaces.find((w) => w.sitePath === root)?.contentPath;
  const fromEnv = process.env.TINA_LOCAL_CONTENT_PATH
    ? resolve(join(root, 'tina'), process.env.TINA_LOCAL_CONTENT_PATH)
    : null;
  const path = fromLedger ?? fromEnv;
  if (!path) return null;
  const status = git(path, ['status', '--porcelain']);
  if (status === null) return { path, dirty: null };
  return { path, dirty: status === '' ? 0 : status.split('\n').length };
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
      'astro:server:setup': ({ server, toolbar }) => {
        if (!toolbar) return;
        const send = () => toolbar.send('fds-toolbar:state', collectState(root));
        toolbar.onAppInitialized('fds', send);
        toolbar.on('fds-toolbar:refresh', send);

        // Push updates when the session or checkout changes underneath us:
        // a new fds dev session rewrites .fds-dev.json, a branch switch
        // rewrites .git/HEAD. Vite's watcher is already running — subscribe
        // it to both and debounce the burst a git checkout produces.
        const watched = [join(root, '.fds-dev.json'), join(root, '.git', 'HEAD')];
        server.watcher.add(watched);
        let timer = null;
        server.watcher.on('all', (_event, path) => {
          if (!watched.includes(path)) return;
          clearTimeout(timer);
          timer = setTimeout(send, 100);
        });

        // Stop button: hand the whole thing to `pstudio fds dev stop`, which
        // owns the cleanup (.env restore, state file, process group — this
        // process included). Detached so it survives the group it kills.
        toolbar.on('fds-toolbar:stop', () => {
          try {
            spawn('pstudio', ['fds', 'dev', 'stop'], { cwd: root, detached: true, stdio: 'ignore' }).unref();
          } catch { /* pstudio not installed — the button is only shown for fds dev sessions */ }
        });
      },
    },
  };
}
