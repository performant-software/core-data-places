import child_process from 'node:child_process';
import fs from 'node:fs';

const TEMP_DIR = './tmp';

export const fetchContent = async () => {
  if (!(process.env.GITHUB_OWNER && process.env.GITHUB_REPO)) {
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
  fs.cpSync(`${TEMP_DIR}/content`, './content', { recursive: true });

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
