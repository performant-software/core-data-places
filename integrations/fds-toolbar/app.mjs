/**
 * Client half of the FDS dev toolbar app. Renders the site/env panel from
 * state the dev server pushes, and keeps a red notification dot on the
 * toolbar icon for the whole session when the env is production-tier.
 */
import { defineToolbarApp } from 'astro/toolbar';

const row = (label, value) => `
  <div style="display: flex; gap: 12px; padding: 3px 0;">
    <span style="opacity: 0.6; min-width: 72px;">${label}</span>
    <span>${value}</span>
  </div>`;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function render(win, state) {
  const site = state.project
    ? `${esc(state.project)}/${esc(state.env)}`
    : 'unknown — not started via fds dev';
  const badge = state.prodTier
    ? '<astro-dev-toolbar-badge badge-style="red" size="large">PRODUCTION DATA — Tina edits write to prod</astro-dev-toolbar-badge>'
    : state.env
      ? '<astro-dev-toolbar-badge badge-style="green">staging-tier</astro-dev-toolbar-badge>'
      : '';
  const links = [
    '<a href="/admin/index.html" target="_blank" style="color: inherit;">Tina admin</a>',
    state.publicDomain ? `<a href="https://${esc(state.publicDomain)}" target="_blank" style="color: inherit;">${esc(state.publicDomain)}</a>` : null,
  ].filter(Boolean).join(' &nbsp;·&nbsp; ');

  win.innerHTML = `
    <header style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
      <h1 style="font-size: 16px; font-weight: 600; margin: 0;">FairData Site</h1>
      ${badge}
    </header>
    <section style="font-size: 13px; font-family: ui-monospace, monospace;">
      ${row('Site', site)}
      ${state.mode ? row('Mode', `${esc(state.mode)}${state.startedAt ? ` (since ${esc(state.startedAt.slice(11, 19))})` : ''}`) : ''}
      ${state.ref ? row('Ref', esc(state.ref)) : ''}
      ${state.siteId ? row('Netlify', esc(state.siteId)) : ''}
      ${row('Links', links)}
    </section>
    <footer style="margin-top: 10px;">
      <astro-dev-toolbar-button size="small" button-style="gray" id="fds-refresh">Refresh</astro-dev-toolbar-button>
    </footer>`;
}

export default defineToolbarApp({
  init(canvas, app, server) {
    const win = document.createElement('astro-dev-toolbar-window');
    canvas.appendChild(win);

    server.on('fds-toolbar:state', (state) => {
      render(win, state);
      // The dot outlives the window: prod-tier stays flagged on the toolbar
      // icon even when the panel is closed.
      app.toggleNotification({ state: state.prodTier === true, level: 'error' });
      win.querySelector('#fds-refresh')?.addEventListener('click', () => server.send('fds-toolbar:refresh', {}));
    });
  },
});
