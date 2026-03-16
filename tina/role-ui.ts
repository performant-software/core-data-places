const ADMIN_ONLY_COLLECTIONS = ['Settings', 'Branding', 'I18n', 'Navbar'];

export const applyEditorRestrictions = async (cms: any) => {
  const user = await cms.authProvider?.getUser?.();
  const role = user?.publicMetadata?.role || 'editor';

  if (typeof document !== 'undefined') {
    document.body.dataset.tinaRole = role;
  }

  if (role !== 'editor') return;

  // Use MutationObserver to hide admin-only sidebar links.
  // This is cosmetic — backend enforcement is the security layer.
  if (typeof MutationObserver === 'undefined') return;

  const hideSidebarItems = () => {
    const links = document.querySelectorAll('a[href*="/admin"]');
    links.forEach((link) => {
      const text = link.textContent?.trim();
      if (text && ADMIN_ONLY_COLLECTIONS.includes(text)) {
        (link as HTMLElement).style.display = 'none';
      }
    });
  };

  // Run once immediately and observe for DOM changes
  hideSidebarItems();
  const observer = new MutationObserver(hideSidebarItems);
  observer.observe(document.body, { childList: true, subtree: true });
};
