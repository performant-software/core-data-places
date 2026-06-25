# TinaCMS → FairData admin branding

The TinaCMS admin UI ships its own "tinacms" llama branding with no config
option to override it. We rebrand it to FairData by patching the published
packages with [`patch-package`](https://github.com/ds300/patch-package). The
patches live in `/patches` and are reapplied automatically on every
`npm install` via the `postinstall` script, so the branded admin is produced by
the normal `tinacms build` on Netlify.

## What gets replaced

| Surface | Tina default | Patched to | Where |
|---|---|---|---|
| Slide-out hamburger menu header | `TinaExtendedIcon` (`tinacms` wordmark) | `FairDataLogo` (db mark + "FairData Sites" wordmark) | `tinacms` |
| Top-bar / page nav headers | `TinaIcon` llama | FairData db icon mark | `tinacms` |
| Modal dialog headers (incl. the auth/login modal) | `TinaIcon` llama | FairData db icon mark | `tinacms` |
| Browser tab title (prod build) | `TinaCMS` | `<Project Name> FairData Site` | `scripts/build.admin-title.mjs` (+ `@tinacms/app` fallback) |
| Browser tab title (dev server) | `TinaCMS` | `FairData` | `@tinacms/cli` |

## Admin browser-tab title

The deployed admin tab reads **`<Project Name> FairData Site`** (singular —
it names the specific site this deployment serves, e.g. "Marronage Mapping
Project FairData Site"). The project name is the Branding collection's `title`
(`content/branding/branding.json`), the same value the public site uses, so it
is only known per-deployment and can't be a static patch.

`scripts/build.admin-title.mjs` runs in the `build` script **after**
`tinacms build` (which emits `public/admin/index.html`) and **before**
`astro build` (which copies `public/` into `dist/`). It reads the cloned
branding title and rewrites the admin `<title>`. If branding is missing it
leaves the patched `@tinacms/app` fallback (`FairData`) in place, so the title
is never "TinaCMS". The dev server (`tinacms dev`) uses the `@tinacms/cli`
title (`FairData`) and is not personalized.

Note the **singular/plural** distinction: the *wordmark* is "FairData Sites"
(the product), while the *tab title* is "… FairData Site" (this one site).

Tina uses two brand components, and the patch preserves Tina's original
icon-vs-wordmark split (so the wordmark never appears twice when the drawer is
open alongside a content-area header):

- `TinaIcon` (llama icon, viewBox `0 0 32 32`) — used in the top-bar/page nav
  headers (`h-10 w-auto`) and modal dialog headers (`w-10 h-auto`). Redefined as
  the **FairData db icon mark** (square, two-tone). These are the compact
  content-chrome marks; left as the icon, not the wordmark.
- `TinaExtendedIcon` (the `tinacms` wordmark) — used once, in the slide-out
  hamburger menu header (`h-8 w-auto`). Its single usage is swapped to a new wide
  `FairDataLogo` component (viewBox `0 0 201 32`, the db mark + "FairData Sites"
  wordmark).

So the patch redefines `TinaIcon` as the FairData icon mark (covering all
content headers + modals) and adds one new `FairDataLogo` wordmark used only in
the nav drawer. Putting the wordmark only in the drawer avoids showing it twice
when the drawer is pinned open next to a content-area header.

The Tina Cloud `loginLlama` PNG is intentionally left alone — it only renders
when `isTinaCloud` is true, and this deployment uses Clerk SSO, so it never
appears.

## Source art

- `fairdata-icon.svg` — db mark only (32×32)
- `fairdata-logo.svg` — db mark + "FairData Sites" wordmark lockup (201×32)

The icon mark and the "FairData" portion of the wordmark were exported from
Figma "Performant Studio Dashboard" (`TWSTQnmnQcQmnYB6pYRPN0`), node `130:1073`
(`studio_logos`). Brand orange is `#F15F26`. The SVG paths in the patches are
derived from these files (drop-shadow filters removed to avoid duplicate
filter-id rendering quirks across repeated instances).

The Figma `studio_logos` component only has a "FairData" wordmark — there is no
"FairData Sites" lockup. The " Sites" glyphs were added by typesetting the word
in **Quicksand SemiBold (600)** — the typeface that matches the FairData
wordmark — and converting it to outline paths with
[opentype.js](https://github.com/opentypejs/opentype.js), positioned to sit on
the same baseline immediately after "FairData". This keeps the lockup a
self-contained vector (no runtime web-font dependency). To regenerate the
"Sites" path, load `Quicksand 600` and run
`font.getPath('Sites', 143, 25.83, 25.2).toPathData(3)` (start x ≈ 143,
baseline y ≈ 25.83, font-size ≈ 25.2 for a ~17.66 cap height in the 32-tall
viewBox), then extend the viewBox width to the resulting advance (~201).

## Regenerating the patches after a TinaCMS upgrade

`patch-package` pins each patch to a package version (e.g.
`tinacms+3.6.1.patch`). After bumping `tinacms`, `@tinacms/app`, or
`@tinacms/cli`, the patch may no longer apply cleanly — `postinstall` will warn.
To refresh:

1. Locate the new render sites in `node_modules/tinacms/dist/index.js`:
   `TinaIcon` (redefine as the icon mark; leave its usages as-is) and
   `TinaExtendedIcon` (swap its single nav-drawer usage to `FairDataLogo`).
   Also the `<title>TinaCMS</title>` in `node_modules/@tinacms/app/index.html`
   and `@tinacms/cli/dist/index.js`.
2. Reapply the edits described above (use the paths in `fairdata-icon.svg` /
   `fairdata-logo.svg`).
3. Run `npx patch-package tinacms @tinacms/app @tinacms/cli`.
4. Delete the stale patch files for the old versions and commit the new ones.
