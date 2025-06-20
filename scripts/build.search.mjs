import fs from 'fs';

/**
 * Pulls in the search indexes from `config.json`.
 *
 * @param config
 *
 * @returns {Promise<void>}
 */
export const buildSearch = async (config) => {
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