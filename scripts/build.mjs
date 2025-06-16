import dotenv from 'dotenv';
import { fetchConfig } from './build.config.mjs';
import { fetchContent } from './build.content.mjs';
import { buildUserDefinedFields } from './build.fields.mjs';
import { buildSearch } from './build.search.mjs';

(async function() {
  // Pull in environment variables
  dotenv.config();

  console.log('Fetching config.json...');
  const config = await fetchConfig();

  console.log('Building userDefinedFields.json from Core Data descriptors...');
  await buildUserDefinedFields(config);

  console.log('Fetching content from repository...');
  await fetchContent();

  console.log('Building search.json from configuration...');
  await buildSearch(config);
}());