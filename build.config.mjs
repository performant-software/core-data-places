import dotenv from 'dotenv';
import fs from 'fs';

const init = async () => {
  const payload = await fetch(process.env.CONFIG_URL).then((response) => response.json());
  const content = JSON.stringify(payload, null, 2);

  fs.writeFileSync('./config.json', content, 'utf8');
};

dotenv.config();

init();