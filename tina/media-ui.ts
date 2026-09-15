const RESTRICTED_BUTTONS = ['New Folder', 'Upload', 'Delete'];

const getMediaManagerContainers = (): HTMLElement[] => {
  if (!document || !document?.body) {
    return [];
  }

  // TinaCMS renders the Media Manager modal header with "Media Manager" text.
  // The content body containing the media manager buttons is rendered in a sibling/parent container.
  const allElements = document.querySelectorAll('*');
  const containers: HTMLElement[] = [];

  allElements.forEach((el) => {
    if (el.children.length === 0 && el.textContent?.trim() === 'Media Manager') {
      const headerDiv = el.closest('div');
      if (headerDiv?.parentElement) {
        containers.push(headerDiv.parentElement as HTMLElement);
      }
    }
  });

  return containers;
};

const disableMediaButtons = () => {
  const mediaContainers = getMediaManagerContainers();
  if (!mediaContainers.length) {
    return;
  }

  mediaContainers.forEach((container) => {
    const buttons = container.querySelectorAll('button');

    buttons.forEach((button: Element) => {
      const el = button as HTMLButtonElement;
      const text = el.textContent?.trim();
      if (!text) return;

      const isRestricted = RESTRICTED_BUTTONS.some(
        (restricted) => text === restricted || text.startsWith(restricted) || text.endsWith(restricted)
      );

      if (!isRestricted) return;

      el.setAttribute('data-media-locked', 'true');
      el.setAttribute('aria-disabled', 'true');
      el.setAttribute('disabled', 'true');
      el.disabled = true;
      el.style.opacity = '0.5';
      el.style.cursor = 'not-allowed';
      el.style.pointerEvents = 'none';
    });
  });
};

/**
 * Apply UI restrictions to the TinaCMS Media Manager.
 * Disables "New Folder", "Upload", and "Delete" buttons.
 * Cosmetic only — backend enforcement is the security layer.
 */
export const applyMediaRestrictions = (cms: any) => {
  if (!document || typeof document === 'undefined') return;

  const styleId = 'tina-media-restrictions';
  if (!document?.getElementById(styleId)) {
    const style = document.createElement('style');
    if (style) {
      style.id = styleId;
      style.textContent = `
        button[data-media-locked="true"] {
          pointer-events: none !important;
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  disableMediaButtons();

  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(disableMediaButtons);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (cms?.events?.subscribe) {
    cms.events.subscribe('media:open', () => {
      disableMediaButtons();
    });
  }
};
