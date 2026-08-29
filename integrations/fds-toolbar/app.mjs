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
  // The content clone's working state: an editing session leaves plain
  // files there, and pushing them is publishing.
  const clone = state.contentClone
    ? state.contentClone.dirty === null
      ? esc(state.contentClone.path)
      : state.contentClone.dirty === 0
        ? 'content clone clean'
        : `<strong>${esc(state.contentClone.dirty)} uncommitted content edit${state.contentClone.dirty === 1 ? '' : 's'}</strong> — pushing publishes`
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
      ${state.version ? row('FDS', esc(state.version)) : ''}
      ${state.workspace?.home ? row('Home', esc(state.workspace.home)) : ''}
      ${contentRepo ? row('Content', contentRepo) : ''}
      ${clone ? row('Edits', clone) : ''}
      ${state.datalayer ? row('Datalayer', `:${esc(state.datalayer.port)} ${state.datalayer.isolated ? 'isolated' : 'shared'}`) : ''}
      ${fairData ? row('FairData', fairData) : ''}
      ${row('Tina', link('/admin/index.html', 'admin'))}
      ${domains ? row('Domains', domains) : ''}
      ${state.siteId ? row('Netlify', esc(state.siteId)) : ''}
    </section>
    <section style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 10px;">
      <div style="display: flex; gap: 14px; flex-wrap: wrap;">
        <div>
          <div style="font-size: 11px; opacity: 0.6; margin-bottom: 6px;">THIS DEV SERVER</div>
          <div style="display: flex; gap: 8px;">
            ${state.mode ? '<astro-dev-toolbar-button size="small" button-style="red" id="fds-stop">Stop</astro-dev-toolbar-button>' : ''}
            <astro-dev-toolbar-button size="small" button-style="gray" disabled title="Planned: re-run scripts/build.mjs — refetch config, content, and search without a restart">Rebuild content</astro-dev-toolbar-button>
            <astro-dev-toolbar-button size="small" button-style="gray" disabled title="Planned: clear the content cache (USE_CONTENT_CACHE) and reload">Clear cache</astro-dev-toolbar-button>
          </div>
        </div>
        <div>
          <div style="font-size: 11px; opacity: 0.6; margin-bottom: 6px;">STAGING (${state.project ? esc(state.project) : 'site'})</div>
          <div style="display: flex; gap: 8px;">
            <astro-dev-toolbar-button size="small" button-style="gray" disabled title="Planned: trigger a Netlify rebuild of the staging deploy (the deployed rebuild function already exists)">Trigger rebuild</astro-dev-toolbar-button>
            <astro-dev-toolbar-button size="small" button-style="gray" disabled title="Planned: re-index the staging Typesense collections">Reindex search</astro-dev-toolbar-button>
          </div>
        </div>
      </div>
      <div style="font-size: 11px; opacity: 0.45; margin-top: 8px;">Grayed actions are stubs — hover for what each will do.</div>
    </section>
    ${state.workspace?.others?.length ? `
    <section style="margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 10px;">
      <div style="font-size: 11px; opacity: 0.6; margin-bottom: 6px;">OTHER WORKSPACES</div>
      <div style="font-size: 13px; font-family: ui-monospace, monospace; display: flex; gap: 14px; flex-wrap: wrap;">
        ${state.workspace.others.map((w) => w.running
    ? `${link(w.url, w.slug)} <span style="color: #7ee787;">●</span>`
    : `<span style="color: #6e7681;">${esc(w.slug)} ●</span>`).join('')}
      </div>
    </section>` : ''}`;
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
