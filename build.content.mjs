import child_process from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';

const init = async () => {
  const dir = '/opt/build/repo/tina/tmp';

  if (!fs.existsSync(dir)) {
    // Create the temporary directory
    fs.mkdirSync(dir);

    // Clone the content repo into the temporary directory
    const url = `https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}.git`;
    child_process.execSync(`git clone ${url} ${dir}`);
  }
};

dotenv.config();

init();