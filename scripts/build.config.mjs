import fs from 'fs';

export const fetchConfig = async () => {
  const configUrl = process.env.CONFIG_URL;
  const configFile = process.env.CONFIG_FILE;

  if (configUrl) {
    const response = await fetch(configUrl);
    const config = await response.json();

    const content = JSON.stringify(config, null, 2);
    fs.writeFileSync('./public/config.json', content, 'utf8');

    console.info('Using remote config.json');
  } else if (configFile) {
    fs.copyFileSync(configFile, './public/config.json');
    console.info(`Copying ${configFile}`);
  } else if (fs.existsSync('./public/config.dev.json')) {
    fs.copyFileSync('./public/config.dev.json', './public/config.json');
    console.info('Copying config.dev.json');
  } else {
    console.info('Using local config.json');
  }

  const data = fs.readFileSync('./public/config.json');
  return JSON.parse(data);
};
