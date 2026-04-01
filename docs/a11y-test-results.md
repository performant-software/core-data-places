# Accessibility Test Results

**Date:** 2026-02-19
**Engine:** axe-core 4.11 via `@axe-core/playwright`
**Ruleset:** WCAG 2.0/2.1/2.2 Level A and AA only
**Browser:** Chromium
**Target:** USS content deployment (localhost:4321)

## Summary

| Status | Count |
|--------|-------|
| Passed | 6 |
| Failed | 1 |
| Skipped | 7 |

**1 unique WCAG violation** found. The test suite filters to WCAG 2.2 AA criteria and uses soft assertions to report all violations per page without stopping early.

## WCAG Violations

### Critical: `image-alt` — Images must have alternative text

- **WCAG:** 1.1.1 Non-text Content (Level A)
- **Issue:** [#553](https://github.com/performant-software/core-data-places/issues/553)
- **Pages:** `/en/pages/Institutions`, `/en/pages/About`, `/en/` (Home, intermittent due to `server:defer` timing)
- **Element:** `<img>` in Banner component (`src/apps/pages/Banner.astro` line 52)
- **Root cause:** `Banner.astro` uses `alt={imageAlt}`, but when TinaCMS content omits the `imageAlt` field, the `alt` attribute is undefined (missing entirely).
- **Fix:** Default to `alt={imageAlt || ''}` for decorative images, or require alt text in the CMS schema.

## Best Practice Issues (Not WCAG Criteria)

These were found during initial testing with all axe-core rules enabled. They are not WCAG violations but are worth addressing:

- **`page-has-heading-one`** — 6 pages lack a visible `<h1>` at scan time because the heading is inside `Header.astro` with `server:defer`
- **`region`** — Header and footer use `<div>` instead of semantic landmarks (`<header>`, `<nav>`, `<footer>`)

## Skipped Tests

These were skipped because the USS config doesn't include the relevant features:

- Paths page / Path detail (no paths collection)
- Search table view / filters panel / detail panel (search type is `list`, not `map`)
- Gallery / Gallery item (no gallery URL configured)

## Test Changes Made

1. **Bug fix:** `test/browser/a11y.test.ts:59` — changed `posts/` to `paths/` for path detail page URLs
2. **WCAG filter:** `checkPage` now uses `.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])` to scan only WCAG criteria
3. **Soft assertions:** `expect.soft()` records all violations without stopping, so every page gets fully scanned

## CI Workflow

`.github/workflows/a11y.yml` — manual trigger (`workflow_dispatch`), chromium only, HTML report uploaded as artifact.

Two modes:
- **With URL input:** tests any deployed URL (staging, production, PR preview)
- **Without URL:** builds static site locally and serves with `astro preview`
