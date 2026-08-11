import fs from 'node:fs';
import { contentPath } from './build.paths.mjs';

export const copyComponents = () => {
  if (!fs.existsSync('./src/components/custom/project')) {
    fs.mkdirSync('./src/components/custom/project');
  }

  const components = contentPath('components');

  // recursive: content dir may not exist yet on a fresh checkout.
  if (!fs.existsSync(components)) {
    fs.mkdirSync(components, { recursive: true });
  }

  // Copy custom components to the appropriate place in the src directory
  fs.cpSync(components, './src/components/custom/project', { recursive: true });
  fs.cpSync('./src/components/custom/default', './src/components/custom/project', { recursive: true });
}
