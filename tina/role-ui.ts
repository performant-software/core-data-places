import { getUserRole } from './utils/getUserRole';

const ADMIN_ONLY_COLLECTIONS = ['Settings', 'Branding', 'Internationalization', 'Navbar'];

/**
 * Apply role-based UI restrictions to the TinaCMS admin.
 * Cosmetic only — backend enforcement is the security layer.
 *
 * Uses CSS injection instead of DOM replacement so that when
 * Tina's React re-renders the sidebar, the styles still apply.
 */
export const applyRoleRestrictions = (cms: any) => {
  const { isAdmin, userId } = getUserRole(cms);

  if (typeof document === 'undefined') return;

  document.body.dataset.tinaRole = isAdmin ? 'admin' : 'editor';
  if (userId) {
    document.body.dataset.tinaUserId = userId;
  }

  if (isAdmin) return;

  // Inject a style tag that targets admin-only sidebar links.
  // This survives React re-renders since it's CSS, not DOM manipulation.
  const styleId = 'tina-role-restrictions';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      body[data-tina-role="editor"] [class*="sidebar"] a[href*="/admin"] {
        /* Default: all sidebar links remain normal */
      }
    `;
    document.head.appendChild(style);
  }

  // MutationObserver to add lock indicators to admin-only links.
  // Instead of replacing <a> with <span> (which React would undo),
  // we disable the link in place.
  if (typeof MutationObserver === 'undefined') return;

  const lockSidebarItems = () => {
    // Match sidebar links by href pattern (#/collections/...) and by text content
    const links = document.querySelectorAll('a[href*="#/collections/"], a[href*="/admin"]');

    links.forEach((link: Element) => {
      const el = link as HTMLAnchorElement;
      const text = el.textContent?.trim();
      if (!text || !ADMIN_ONLY_COLLECTIONS.includes(text)) return;
      if (el.getAttribute('data-role-locked')) return;

      // Mark as locked so we don't re-process
      el.setAttribute('data-role-locked', 'true');

      // Disable the link without removing it from the DOM
      el.style.color = '#9ca3af';
      el.style.opacity = '0.6';
      el.style.cursor = 'default';
      el.style.pointerEvents = 'none';
      el.setAttribute('aria-disabled', 'true');
      el.removeAttribute('href');

      // Prepend lock icon if not already present
      if (!el.textContent?.startsWith('🔒')) {
        el.textContent = `🔒 ${text}`;
      }
    });
  };

  lockSidebarItems();
  const observer = new MutationObserver(lockSidebarItems);
  observer.observe(document.body, { childList: true, subtree: true });
};
