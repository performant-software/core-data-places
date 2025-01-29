import dotenv from 'dotenv';
import fs from 'fs';

const init = async () => {
  const configUrl = process.env.CONFIG_URL;

  if (configUrl) {
    const response = await fetch(configUrl);
    const config = await response.json();
    const content = JSON.stringify(config, null, 2);
    fs.writeFileSync('./public/config.json', content, 'utf8');
  } else {
    console.log('Using local config.')
  }
};

dotenv.config();

init();
