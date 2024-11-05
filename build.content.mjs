import child_process from 'child_process';
import dotenv from 'dotenv';
import fs from 'fs';

const init = async () => {
  // Create the temporary directory
  if (!fs.existsSync(process.env.TINA_LOCAL_CONTENT_PATH)) {
    fs.mkdirSync(process.env.TINA_LOCAL_CONTENT_PATH);
  }

  // Clone the content repo into the temporary directory
  const url = `https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}.git`;
  child_process.execSync(`git clone ${url} ${process.env.TINA_LOCAL_CONTENT_PATH}`);
};

dotenv.config();

init();