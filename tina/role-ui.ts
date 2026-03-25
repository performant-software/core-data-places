import { getUserRoleAsync } from './utils/getUserRole';

const ADMIN_ONLY_COLLECTIONS = ['Settings', 'Branding', 'Internationalization', 'Navbar', 'Pages'];

/**
 * Apply role-based UI restrictions to the TinaCMS admin.
 * Cosmetic only — backend enforcement is the security layer.
 */
export const applyRoleRestrictions = async (cms: any) => {
  const { isAdmin, userId } = await getUserRoleAsync(cms);

  if (typeof document === 'undefined') return;

  document.body.dataset.tinaRole = isAdmin ? 'admin' : 'editor';
  if (userId) {
    document.body.dataset.tinaUserId = userId;
  }

  if (isAdmin) return;

  // Form-level read-only behavior is CSS-only to avoid MutationObserver loops.
  // The data-tina-read-only attribute is set by OwnershipNotice.tsx.
  const styleId = 'tina-role-restrictions';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Disable all interactive elements inside the form scroll area */
      body[data-tina-read-only="true"] .relative.w-full.flex-1.overflow-hidden button,
      body[data-tina-read-only="true"] .relative.w-full.flex-1.overflow-hidden input,
      body[data-tina-read-only="true"] .relative.w-full.flex-1.overflow-hidden select,
      body[data-tina-read-only="true"] .relative.w-full.flex-1.overflow-hidden textarea,
      body[data-tina-read-only="true"] .relative.w-full.flex-1.overflow-hidden [contenteditable="true"],
      body[data-tina-read-only="true"] .relative.w-full.flex-1.overflow-hidden [role="textbox"],
      body[data-tina-read-only="true"] .relative.w-full.flex-1.overflow-hidden [role="combobox"],
      body[data-tina-read-only="true"] .relative.w-full.flex-1.overflow-hidden [role="radio"],
      body[data-tina-read-only="true"] .relative.w-full.flex-1.overflow-hidden [role="toolbar"],
      body[data-tina-read-only="true"] .relative.w-full.flex-1.overflow-hidden [class*="cursor-pointer"] {
        pointer-events: none !important;
        opacity: 0.5;
      }

      /* Hide the status dot SVG in the form header bar */
      body[data-tina-read-only="true"] .border-b.border-gray-100 > svg {
        display: none;
      }
      /* Show lock icon in its place */
      body[data-tina-read-only="true"] .border-b.border-gray-100:has(nav[aria-label="breadcrumb"])::after {
        content: "\\1F512";
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);
  }

  // MutationObserver only for sidebar link locking — no form manipulation.
  if (typeof MutationObserver === 'undefined') return;

  const lockSidebarItems = () => {
    const links = document?.querySelectorAll('a[href*="#/collections/"], a[href*="/admin"]');

    if (!links || !links?.length) {
      return;
    }

    links.forEach((link: Element) => {
      const el = link as HTMLAnchorElement;
      const text = el.textContent?.trim();
      if (!text || !ADMIN_ONLY_COLLECTIONS.includes(text)) return;
      if (el.getAttribute('data-role-locked')) return;

      el.setAttribute('data-role-locked', 'true');
      el.style.color = '#9ca3af';
      el.style.opacity = '0.6';
      el.style.cursor = 'default';
      el.style.pointerEvents = 'none';
      el.setAttribute('aria-disabled', 'true');
      el.removeAttribute('href');

      if (!el.textContent?.startsWith('\u{1F512}')) {
        el.textContent = `\u{1F512} ${text}`;
      }
    });
  };

  lockSidebarItems();
  const observer = new MutationObserver(lockSidebarItems);
  observer.observe(document.body, { childList: true, subtree: true });
};
