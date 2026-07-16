/**
 * Client half of the FDS dev toolbar app. Renders the site/env panel from
 * state the dev server pushes (on init, and again whenever .fds-dev.json or
 * .git/HEAD change), and keeps a red notification dot on the toolbar icon
 * for the whole session when the env is production-tier.
 */
import { defineToolbarApp } from 'astro/toolbar';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const row = (label, value) => `
  <div style="display: flex; gap: 12px; padding: 3px 0;">
    <span style="opacity: 0.6; min-width: 72px;">${label}</span>
    <span>${value}</span>
  </div>`;

const link = (href, text) => `<a href="${esc(href)}" target="_blank" style="color: inherit;">${esc(text)}</a>`;

function render(win, state) {
  const site = state.project
    ? `${esc(state.project)}/${esc(state.env)}`
    : 'unknown — not started via fds dev';
  const badge = state.prodTier
    ? '<astro-dev-toolbar-badge badge-style="red" size="large">PRODUCTION DATA — Tina edits write to prod</astro-dev-toolbar-badge>'
    : state.env
      ? '<astro-dev-toolbar-badge badge-style="green">staging-tier</astro-dev-toolbar-badge>'
      : '';

  // FAIR endpoints, one row each, only when the site knows them.
  const fairData = state.fairData
    ? [
      link(state.fairData, state.fairData.replace(/^https?:\/\//, '')),
      ...state.fairDataProjects.map((id) => link(`${state.fairData}/projects/${id}`, `project ${id}`)),
    ].join(' &nbsp;·&nbsp; ')
    : null;
  const contentRepo = state.content
    ? link(`https://github.com/${state.content.repo}${state.content.branch ? `/tree/${state.content.branch}` : ''}`,
      `${state.content.repo}${state.content.branch ? ` @ ${state.content.branch}` : ''}`)
    : null;
  const domains = [
    state.publicDomain ? link(`https://${state.publicDomain}`, state.publicDomain) : null,
    state.adminDomain ? link(`https://${state.adminDomain}`, `${state.adminDomain} (admin)`) : null,
  ].filter(Boolean).join(' &nbsp;·&nbsp; ');

  win.innerHTML = `
    <header style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; gap: 12px;">
      <h1 style="font-size: 16px; font-weight: 600; margin: 0; white-space: nowrap;">FairData Site</h1>
      ${badge}
    </header>
    <section style="font-size: 13px; font-family: ui-monospace, monospace;">
      ${row('Site', site)}
      ${row('Output', esc(state.output))}
      ${state.mode ? row('Mode', `${esc(state.mode)}${state.startedAt ? ` (since ${esc(state.startedAt.slice(11, 19))})` : ''}`) : ''}
      ${state.ref ? row('Ref', esc(state.ref)) : ''}
      ${contentRepo ? row('Content', contentRepo) : ''}
      ${fairData ? row('FairData', fairData) : ''}
      ${row('Tina', link('/admin/index.html', 'admin'))}
      ${domains ? row('Domains', domains) : ''}
      ${state.siteId ? row('Netlify', esc(state.siteId)) : ''}
    </section>
    ${state.mode ? `
    <footer style="margin-top: 10px; display: flex; gap: 8px;">
      <astro-dev-toolbar-button size="small" button-style="red" id="fds-stop">Stop dev server</astro-dev-toolbar-button>
    </footer>` : ''}`;
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

      // Stop is two-click: arm, then fire. The server side delegates to
      // `dhtools fds dev stop`, which owns cleanup — this page will go dark.
      const stop = win.querySelector('#fds-stop');
      stop?.addEventListener('click', () => {
        if (stop.dataset.armed === 'true') {
          server.send('fds-toolbar:stop', {});
          stop.textContent = 'Stopping…';
        } else {
          stop.dataset.armed = 'true';
          stop.textContent = 'Click again to stop everything';
        }
      });
    });
  },
});
