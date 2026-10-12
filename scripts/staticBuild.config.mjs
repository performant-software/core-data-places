import { parseArgs } from 'node:util';
import { fetchConfig } from './build.config.mjs';

const REQUIRED_ENV_VARS = [
  'CORE_DATA_SERVICE_EMAIL',
  'CORE_DATA_SERVICE_PASSWORD',
  'IIIF_CLOUD_URL',
  'IIIF_CLOUD_API_KEY',
  'R2_BUCKET',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_ENDPOINT'
];

const DEFAULT_POLL_INTERVAL_SECONDS = 10;
const DEFAULT_POLL_MAX_ATTEMPTS = 360; // 1 hour at the default interval

/**
 * Parses CLI flags and environment variables into a single configuration object for the static
 * build pipeline, and validates that everything required is present.
 *
 * - project_ids/base_url/destination: CLI flag (--project-ids/--base-url/--destination) or
 *   equivalent env var (PROJECT_IDS/BASE_URL/DESTINATION); project_ids additionally falls back to
 *   this site's own public/config.json (core_data.project_ids) when omitted entirely.
 * - Everything else (credentials, hostnames) is env-only, never a CLI flag, so secrets never show
 *   up in shell history or a process listing.
 *
 * @returns {Promise<Object>}
 */
export const resolveConfig = async () => {
  const { values } = parseArgs({
    options: {
      'project-ids': { type: 'string' },
      'base-url': { type: 'string' },
      destination: { type: 'string' }
    },
    strict: false
  });

  const siteConfig = await fetchConfig();

  const projectIds = parseProjectIds(values['project-ids'] || process.env.PROJECT_IDS) ||
    siteConfig?.core_data?.project_ids;
  const baseUrl = values['base-url'] || process.env.BASE_URL;
  const destination = values.destination || process.env.DESTINATION;

  const errors = [];
  if (!projectIds || projectIds.length === 0) {
    errors.push('project_ids is required (--project-ids, PROJECT_IDS, or core_data.project_ids in config.json)');
  }
  if (!baseUrl) {
    errors.push('base_url is required (--base-url or BASE_URL)');
  }
  if (!destination) {
    errors.push('destination is required (--destination or DESTINATION)');
  }

  REQUIRED_ENV_VARS.forEach((name) => {
    if (!process.env[name]) {
      errors.push(`${name} environment variable is required`);
    }
  });

  if (errors.length > 0) {
    throw new Error(`Invalid static build configuration:\n  ${errors.join('\n  ')}`);
  }

  return {
    projectIds,
    baseUrl,
    destination,
    coreDataUrl: process.env.CORE_DATA_URL || siteConfig.core_data.url,
    coreDataServiceEmail: process.env.CORE_DATA_SERVICE_EMAIL,
    coreDataServicePassword: process.env.CORE_DATA_SERVICE_PASSWORD,
    iiifCloudUrl: process.env.IIIF_CLOUD_URL,
    iiifCloudApiKey: process.env.IIIF_CLOUD_API_KEY,
    r2: {
      bucket: process.env.R2_BUCKET,
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      endpoint: process.env.R2_ENDPOINT
    },
    pollIntervalMs: 1000 * Number(process.env.STATIC_BUILD_POLL_INTERVAL_SECONDS || DEFAULT_POLL_INTERVAL_SECONDS),
    pollMaxAttempts: Number(process.env.STATIC_BUILD_POLL_MAX_ATTEMPTS || DEFAULT_POLL_MAX_ATTEMPTS)
  };
};

const parseProjectIds = (value) => {
  if (!value) return null;

  return String(value).split(',').map((id) => id.trim()).filter(Boolean);
};
