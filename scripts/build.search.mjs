import fs from 'fs';
import path from 'node:path';
import { contentPath } from './build.paths.mjs';

const PUBLIC_SEARCH_DIR = './public/search';

/**
 * Suffix used for the ItemsJS configuration file that accompanies each data file.
 */
const CONFIG_SUFFIX = '.itemsjs.json';

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

export const buildStaticSearch = async (config) => {
  const indexNames = config.search
    .filter((search) => search.static)
    .map((search) => search.static.index_name);

  if (!indexNames.length) {
    return;
  }

  if (!fs.existsSync(contentPath())) {
    console.warn(`Skipping static search indexes; ${contentPath()} does not exist`);
    return;
  }

  fs.mkdirSync(PUBLIC_SEARCH_DIR, { recursive: true });

  for (const indexName of indexNames) {
    for (const filename of [`${indexName}.json`, `${indexName}${CONFIG_SUFFIX}`]) {
      const source = contentPath('search', filename);

      if (!fs.existsSync(source)) {
        throw new Error(
          `Missing static search file "${source}". Each "static.index_name" in config.json`
          + ` requires both <index_name>.json and <index_name>${CONFIG_SUFFIX} in /content/search.`
        );
      }

      fs.cpSync(source, path.join(PUBLIC_SEARCH_DIR, filename));
      console.info(`Copying ${source}`);
    }
  }
};
