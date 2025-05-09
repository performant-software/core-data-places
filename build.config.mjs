import dotenv from 'dotenv';
import fs from 'fs';

const init = async () => {
  const configUrl = process.env.CONFIG_URL;

  if (configUrl) {
    const response = await fetch(configUrl);
    const config = await response.json();
    const content = JSON.stringify(config, null, 2);

    fs.writeFileSync('./public/config.json', content, 'utf8');

    console.info('Using remote config.json');
  } else if (fs.existsSync('./public/config.dev.json')) {
    fs.copyFileSync('./public/config.dev.json', './public/config.json');
    console.info('Copying config.dev.json');
  } else {
    console.info('Using local config.json');
  }

  console.info('');
};

dotenv.config();

init();
