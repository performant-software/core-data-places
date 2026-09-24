import { fetchConfig } from './build.config.mjs';
import { fetchContent } from './build.content.mjs';
import { buildUserDefinedFields, fetchDescriptors } from './build.fields.mjs';
import { buildSearch, validateSearches } from './build.search.mjs';
import { copyComponents } from './build.components.mjs';

(async function() {
  // Pull in environment variables
  try { process.loadEnvFile() } catch {};

  console.log('Fetching config.json...');
  const config = await fetchConfig();

  console.log('Fetching Core Data descriptors...');
  const descriptors = await fetchDescriptors(config);

  console.log('Validating searches...');
  validateSearches(config, descriptors, process.env.STATIC_BUILD === 'true');

  console.log('Building userDefinedFields.json from Core Data descriptors...');
  const userDefinedFields = buildUserDefinedFields(descriptors);

  console.log('Fetching content from repository...');
  await fetchContent();

  console.log('Building search.json from configuration...');
  await buildSearch(config, userDefinedFields);

  console.log('Copying custom components...');
  copyComponents();
}());
