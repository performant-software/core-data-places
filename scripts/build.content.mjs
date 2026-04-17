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
  const branch = process.env.GITHUB_BRANCH;
  const branchArg = branch ? `--branch ${branch} --single-branch` : '';
  child_process.execSync(`git clone ${branchArg} ${url} ${TEMP_DIR}`);

  // Remove existing content to prevent merge artifacts from previous projects
  if (fs.existsSync('./content')) {
    fs.rmSync('./content', { recursive: true });
  }

  // Copy the "content" folder to the current directory
  fs.cpSync(`${TEMP_DIR}/content`, './content', { recursive: true });

  // Remove the temporary directory.
  fs.rmSync(TEMP_DIR, { recursive: true });
};
