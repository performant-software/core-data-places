import path from 'node:path';

// TinaCMS resolves TINA_LOCAL_CONTENT_PATH relative to the `tina` folder; these
// scripts run from the repo root. Derive the root-relative content dir from the
// same variable so they can't drift.
export const contentRoot = process.env.TINA_LOCAL_CONTENT_PATH
  ? path.join('tina', process.env.TINA_LOCAL_CONTENT_PATH)
  : '.';

export const contentPath = (...segments) => path.join(contentRoot, 'content', ...segments);
