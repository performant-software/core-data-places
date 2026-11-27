import child_process from 'node:child_process';
import fs from 'node:fs';
import { contentPath } from './build.paths.mjs';

const TEMP_DIR = './tmp';

export const fetchContent = async () => {
  // Skip the git fetch and use whatever content is already on disk. Kept
  // separate from TINA_LOCAL_CONTENT_PATH so you can point Tina at a local dir
  // and still fetch content into it initially.
  const skipFetch = process.env.SKIP_CONTENT_FETCH === 'true';

  if (skipFetch || !(process.env.GITHUB_OWNER && process.env.GITHUB_REPO)) {
    if (skipFetch) {
      console.info(`Skipping content fetch; using ${contentPath()}`);
    }

    // Copy the branding file to the public directory
    const branding = contentPath('branding', 'branding.json');

    if (fs.existsSync(branding)) {
      fs.cpSync(branding, './public/branding.json');
    }

    return;
  }

  // Remove the temporary directory if it exists
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
  }

  // Clone the content repo into the temporary directory.
  // Honor GITHUB_BRANCH so each Netlify env can read content from its own branch
  // (e.g. staging from `develop`, prod from `main`). Default to `main` when unset.
  const url = `https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}.git`;
  const branch = process.env.GITHUB_BRANCH || 'main';
  console.log(`Cloning ${process.env.GITHUB_REPO}#${branch}`);
  child_process.execFileSync('git', ['clone', '--branch', branch, '--single-branch', url, TEMP_DIR], { stdio: 'inherit' });

  // Copy the "content" folder to the current directory
  fs.cpSync(`${TEMP_DIR}/content`, contentPath(), { recursive: true });

  // Copy the branding file to the public directory
  fs.cpSync(`${TEMP_DIR}/content/branding/branding.json`, './public/branding.json');

  // Append any custom Netlify config to the main one
  // (mainly used for redirecting the admin site to a Performant Studio subdomain)
  if (fs.existsSync(`${TEMP_DIR}/netlify.toml`)) {
    const customConfig = fs.readFileSync(`${TEMP_DIR}/netlify.toml`, 'utf8');
    const existingConfig = fs.readFileSync('./netlify.toml', 'utf8');
    const newConfig = `${existingConfig}\n\n${customConfig}`;
    fs.writeFileSync('./netlify.toml', newConfig);
  }

  // Remove the temporary directory.
  fs.rmSync(TEMP_DIR, { recursive: true });
};
