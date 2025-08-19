/**
 * Utility functions for TinaCMS Visual Editing support
 */

/**
 * Check if the current page is in visual editing mode
 */
export function isVisualEditingMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('__tina_edit') === 'true' || 
         urlParams.has('tina_edit') ||
         (window.location.hostname === 'localhost' && window.location.pathname.startsWith('/admin'));
}

/**
 * Initialize visual editing mode if enabled
 */
export function initializeVisualEditing(): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (isVisualEditingMode()) {
    // Add visual editing class to document
    document.documentElement.classList.add('tina-edit-mode');
    
    // Add visual editing styles
    const style = document.createElement('style');
    style.textContent = `
      .tina-edit-mode [data-tina-field] {
        position: relative;
        outline: 2px dashed #3b82f6;
        outline-offset: 2px;
      }
      
      .tina-edit-mode [data-tina-field]:hover {
        outline-color: #1d4ed8;
        background-color: rgba(59, 130, 246, 0.1);
      }
    `;
    document.head.appendChild(style);
  }
}