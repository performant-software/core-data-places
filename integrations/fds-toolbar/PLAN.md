# FDS dev toolbar — feature plan

Status: sketch on `feat/fds-dev-toolbar` (2026-07-16), not yet PR'd. v1–v3
built and verified live: identity panel (site/env/ref/content repo/FAIR
endpoints), production-tier warning (red badge + persistent icon dot),
live state push (watches `.fds-dev.json` and `.git/HEAD` via Vite's
watcher), working Stop button (delegates to `dhtools fds dev stop`), and
stubbed action buttons.

The toolbar exists only under `astro dev` — never in builds, static or SSR.
Its server half runs on the developer's machine with their credentials,
which is what lets local buttons act on remote (staging) targets.

## To build, in rough order

1. **Rebuild content** (local) — re-run `scripts/build.mjs` with the
   session's env from the toolbar: refetch config.json, content repo, and
   search.json without restarting the dev server. Machinery proven (the
   fds dev pre-build does exactly this); needs a busy state in the UI and
   a push when done.

2. **Trigger rebuild** (staging) — fire the staging deploy's rebuild from
   the toolbar. Plumbing exists: the deployed `rebuild` edge function /
   Netlify build hook; the toolbar's server side has the Netlify CLI.

3. **Reindex search** (staging) — run the Typesense reindex rake task
   against the staging backend (today: Heroku rake, per the local-dev
   workflow docs).

4. **Clear cache** (local) — clear the content cache used when
   USE_CONTENT_CACHE=true and nudge a reload.

5. **Static-preview section** — dev-only middleware serving the latest
   `fds static` bake (`dist/`) at `/__static-preview/`, with toolbar links
   to the baked FAIR artifacts: Linked Art JSON, baked search index,
   pmtiles map preview, IIIF snapshots. Shown only when a bake exists.
   This is the "static dev mode" idea: the dev server is the thin layer
   for inspecting static output; deployed static sites never get a toolbar.

6. **More endpoints as they get homes** — FairCopy Server, FairImage, the
   Performant Studio dashboard (fairdata.performant.studio). Not linked
   yet because no site env/config carries their URLs; each is a two-line
   addition to `collectState` once a source of truth exists.

## Separate track (not this integration)

An on-staging admin widget (Clerk-gated, baked into the framework) so
content editors can trigger rebuilds from the deployed site without a
developer's laptop. The deployed `rebuild` edge function is the embryo.
Sequence after the dev cockpit shows which actions get used.

## Design notes for the PR conversation

- `.fds-dev.json` is now read by two codebases (dhtools writes, this
  integration reads) — mark the shape as a small contract in dhtools'
  `daemon.ts` when this merges.
- All panel values are escaped before `innerHTML`; data sources are the
  developer's own filesystem and env, dev-only.
- Stop button delegates to `dhtools fds dev stop` (spawned detached) so
  cleanup ownership stays in one place; the button renders only for
  dhtools-managed sessions.
