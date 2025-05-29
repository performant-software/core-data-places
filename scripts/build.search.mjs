import fs from 'fs';
import config from '../public/config.json' with { type: 'json' };

export const buildSearch = async () => {
  const searches = {};

  for (const search of config.search) {
    searches[`index_${search.name}`] = {
      tinaLabel: `Search: ${search.name}`,
      defaultValue: search.name
    }
  }

  const content = JSON.stringify(searches, null, 2);
  fs.writeFileSync('./src/i18n/search.json', content, 'utf8');
};