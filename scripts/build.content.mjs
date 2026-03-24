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

  // Clone the content repo into the temporary directory
  const url = `https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}.git`;
  child_process.execSync(`git clone ${url} ${TEMP_DIR}`);

  // Copy the "content" folder to the current directory
  fs.cpSync(`${TEMP_DIR}/content`, './content', { recursive: true });

  // Append any custom Netlify config to the main one
  // (mainly used for redirecting the admin site to a Performant Studio subdomain)
  if (fs.existsSync('./content/netlify.toml')) {
    const customConfig = fs.readFileSync('./content/netlify.toml', 'utf8');
    const existingConfig = fs.readFileSync('./netlify.toml', 'utf8');
    const newConfig = `${existingConfig}\n${customConfig}`;
    fs.writeFileSync('./netlify.toml', newConfig);
  }

  // Remove the temporary directory.
  fs.rmSync(TEMP_DIR, { recursive: true });
};
