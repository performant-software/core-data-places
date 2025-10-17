import fs from 'node:fs';

export const copyComponents = () => {
  if (!fs.existsSync('./src/components/custom/project')) {
    fs.mkdirSync('./src/components/custom/project');
  }

  if (!fs.existsSync('./content/components')) {
    fs.mkdirSync('./content/components');
  }

  // Copy custom components to the appropriate place in the src directory
  fs.cpSync('./content/components', './src/components/custom/project', { recursive: true });
  fs.cpSync('./src/components/custom/default', './src/components/custom/project', { recursive: true });
}
