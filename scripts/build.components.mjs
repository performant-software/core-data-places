import fs from 'node:fs';
const LOCAL_CONTENT_ROOT = process.env.BASE_LOCAL_CONTENT_PATH || './';

export const copyComponents = () => {
  if (!fs.existsSync('./src/components/custom/project')) {
    fs.mkdirSync('./src/components/custom/project');
  }

  if (!fs.existsSync(`${LOCAL_CONTENT_ROOT}content/components`)) {
    fs.mkdirSync(`${LOCAL_CONTENT_ROOT}content/components`);
  }

  // Copy custom components to the appropriate place in the src directory
  fs.cpSync(`${LOCAL_CONTENT_ROOT}content/components`, './src/components/custom/project', { recursive: true });
  fs.cpSync('./src/components/custom/default', './src/components/custom/project', { recursive: true });
}
