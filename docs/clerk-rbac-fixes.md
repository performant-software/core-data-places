# Clerk RBAC Fixes

Tracking fixes and improvements for PR #577 (Clerk-based RBAC for TinaCMS).

## Quick Wins

- [ ] **Clerk logout doesn't fully sign out** — `session.remove()` should be `signOut()` in `tina/auth-provider.ts` (PR #583)
- [ ] **Unpublished posts/paths visible in SSR** — detail pages don't check published status; should return 404 (PR #584)
- [ ] **Dev script timeout** — `scripts/dev.sh` needs pre-build step to avoid Netlify CLI timeout (local only, not PRed)

## Known Limitations (PR #586)

- [ ] **`_ownershipNotice` appears as sort option** — The pseudo-field shows up in the collection list sort dropdown. Need to find a way to exclude it or use a different approach for injecting the banner.
- [ ] **CSS selectors depend on Tina's utility classes** — Form disabling targets classes like `.relative.w-full.flex-1.overflow-hidden` and `.border-b.border-gray-100`. These could break if TinaCMS updates its markup in a future version.
- [ ] **Pre-existing content without `creator` field is editable by all editors** — Posts/paths created before the RBAC feature have no `creator.id`, so `OwnershipNotice` treats them as owned by the current user. Need a migration strategy or a policy decision (e.g., admin-only for unclaimed content).

## Compatibility & Maintenance Questions

- [x] **Non-Clerk site compatibility** — Resolved: `cmsCallback` gates role-ui behind `useSSO`, and `getUserRole` defaults to admin when no Clerk user is found. Non-Clerk sites are unaffected by RBAC restrictions.
- [ ] **Migrate non-Clerk sites to Clerk** — Existing sites using native Tina user management (`TINA_PUBLIC_AUTH_USE_SSO=false`) should be migrated to Clerk for RBAC. Needs: a migration guide or script covering Clerk org setup, user invitations, env var changes (`CLERK_SECRET`, `TINA_PUBLIC_CLERK_PUBLIC_KEY`, `TINA_PUBLIC_CLERK_ORG_ID`, `TINA_PUBLIC_AUTH_USE_SSO=true`), and assigning `creator` fields to existing content so ownership works.
- [ ] **Retesting after Tina/Astro upgrades** — The CSS selectors and MutationObserver approach depend on Tina's internal DOM structure. Define a manual or automated test checklist to run after upgrading TinaCMS or Astro (sidebar locking, form disabling, ownership banner, save guard).
- [ ] **Adding new content types** — When new collections (beyond Posts/Paths) are added that editors should access, they need: the `_ownershipNotice` field, `creator` fields, `beforeSubmit` guard, and to NOT be in the `ADMIN_ONLY_COLLECTIONS` list. Document this as part of the "add a new collection" checklist.
- [ ] **Adding features to existing content types** — New fields on Posts/Paths are automatically covered by the CSS-disable approach (targets the entire form scroll area). But new field types with unusual DOM elements might not be caught. Test RBAC after adding fields.

## Pre-existing Issues (not caused by RBAC work)

- [ ] **Timeline MDX component not rendering in post preview** — Map and table components render correctly, but `<timeline>` renders as code. Component is registered in `PostContent.tsx` and used in `demo-of-post-functionality.mdx`. May be a data parsing issue with the HTML-encoded JSON in the `data` attribute.

## Visual Editing

- [ ] **Post title/author/date don't live-update in Tina preview** — These fields are server-rendered in `Post.astro` for fast page shell loading; only `body` is in the `PostContent.tsx` React component wired to `useTina()`. This split was deliberate (Derek's server islands work, `4229b63`; Rebecca kept it when adding visual editing, `27eaec4`). Fix would move metadata rendering into `PostContent.tsx`, trading server-render speed for live editability. Same issue likely applies to paths.

## Deferred (needs Rebecca's review)

- [ ] **#580 Improve error feedback** — Tina shows generic errors for unauthorized actions. Backend already returns descriptive messages but Tina's frontend doesn't surface them. Rebecca says this involves intercepting Tina's native error handling.
- [ ] **#581 Hide admin-only sidebar links** — Addressed in PR #586 with MutationObserver approach. Rebecca should review the implementation.
- [ ] **#580 (partial) Read-only fields for editors** — Addressed in PR #586 with CSS-disable approach. Rebecca should review.
