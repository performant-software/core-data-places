import fs from 'fs';
import path from 'path';
import extract from 'extract-zip';

const DATA_DIR = 'api';

/**
 * Logs in to core-data-cloud using a service account, exports each project's data as JSON,
 * downloads and merges the results into api/, and returns the merged resource_ids list
 * (the iiif-cloud resource UUIDs for every piece of media content across all exported projects).
 *
 * @param {Object} config - see staticBuild.config.mjs#resolveConfig
 *
 * @returns {Promise<string[]>} the merged, de-duplicated resource_ids
 */
export const exportProjectData = async (config) => {
  const token = await login(config);

  fs.rmSync(DATA_DIR, { recursive: true, force: true });
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const descriptors = new Map();
  const resourceIds = new Set();
  // Per model directory (e.g. "events"), the uuid -> record map accumulated across every
  // project's index.json, so a shared record appearing in more than one project is kept once.
  const modelIndexes = {};

  for (const projectId of config.projectIds) {
    console.info(`[core-data] Exporting project ${projectId}...`);

    const zipPath = await exportProject(config, token, projectId);
    const extractDir = path.join(DATA_DIR, `.tmp-${projectId}`);
    await extract(zipPath, { dir: path.resolve(extractDir) });

    mergeDescriptors(extractDir, descriptors);
    mergeResourceIds(extractDir, resourceIds);
    mergeModelDirectories(extractDir, modelIndexes);

    fs.rmSync(extractDir, { recursive: true, force: true });
    fs.rmSync(zipPath, { force: true });
  }

  writeMergedDescriptors(descriptors);
  writeMergedResourceIds(resourceIds);
  writeMergedModelIndexes(modelIndexes);

  return [...resourceIds];
};

const login = async (config) => {
  const response = await fetch(`${config.coreDataUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: config.coreDataServiceEmail,
      password: config.coreDataServicePassword
    })
  });

  if (!response.ok) {
    throw new Error(`core-data-cloud login failed (${response.status}): ${await response.text()}`);
  }

  const { token } = await response.json();
  return token;
};

// Triggers the JSON export for one project, polls until it completes, and downloads the resulting
// zip to a local temp path, returning that path.
const exportProject = async (config, token, projectId) => {
  // base_url is required by core-data-cloud so it can generate correct, fully-qualified "id"
  // fields for the IIIF manifests/collections it now writes as part of the export (see
  // Export::ManifestsGenerator in core-data-cloud) - the same base_url this script later sends to
  // iiif-cloud for its own static asset generation.
  const params = new URLSearchParams({ base_url: config.baseUrl });
  const triggerResponse = await fetch(
    `${config.coreDataUrl}/core_data/projects/${projectId}/export_json_data?${params}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!triggerResponse.ok) {
    throw new Error(`Failed to trigger export for project ${projectId} (${triggerResponse.status}): ${await triggerResponse.text()}`);
  }

  const { job_id: jobId, errors } = await triggerResponse.json();
  if (errors?.length > 0) {
    throw new Error(`core-data-cloud rejected the export for project ${projectId}: ${JSON.stringify(errors)}`);
  }

  const job = await pollJob(config, token, jobId);
  if (job.status === 'failed') {
    throw new Error(`Export job ${jobId} for project ${projectId} failed`);
  }

  const downloadResponse = await fetch(job.download_url);
  if (!downloadResponse.ok) {
    throw new Error(`Failed to download export zip for project ${projectId} (${downloadResponse.status})`);
  }

  const zipPath = path.join(DATA_DIR, `.tmp-${projectId}.zip`);
  fs.writeFileSync(zipPath, Buffer.from(await downloadResponse.arrayBuffer()));

  return zipPath;
};

const pollJob = async (config, token, jobId) => {
  for (let attempt = 0; attempt < config.pollMaxAttempts; attempt += 1) {
    const response = await fetch(`${config.coreDataUrl}/core_data/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error(`Failed to check status of job ${jobId} (${response.status}): ${await response.text()}`);
    }

    const { job } = await response.json();
    if (job.status === 'completed' || job.status === 'failed') {
      return job;
    }

    console.info(`[core-data] Job ${jobId} status: ${job.status} (attempt ${attempt + 1}/${config.pollMaxAttempts})`);
    await sleep(config.pollIntervalMs);
  }

  throw new Error(`Timed out waiting for job ${jobId} to complete`);
};

// descriptors.json is a single flat file at the top of each project's export (not uuid-keyed per
// file like the model directories below), so extracting multiple projects into the same directory
// would have each project's copy simply clobber the last. Instead, every project's entries are
// accumulated (de-duplicated by identifier) here, and the merged result is written once at the end.
const mergeDescriptors = (extractDir, descriptors) => {
  const filePath = path.join(extractDir, 'descriptors.json');
  if (!fs.existsSync(filePath)) return;

  const { descriptors: items } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  (items || []).forEach((item) => descriptors.set(item.identifier, item));
};

// Same flat-file merge concern as descriptors.json, see above.
const mergeResourceIds = (extractDir, resourceIds) => {
  const filePath = path.join(extractDir, 'resources.json');
  if (!fs.existsSync(filePath)) return;

  const { resource_ids: ids } = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  (ids || []).forEach((id) => resourceIds.add(id));
};

// Every top-level entry besides descriptors.json/resources.json is a model directory (events/,
// items/, etc.). The per-record files within it (<uuid>.json, <uuid>/<related>.json) are safe to
// copy as-is across projects (uuid-keyed, non-colliding), but the model's own index.json is -
// like descriptors.json/resources.json - a single flat file that would otherwise be clobbered by
// whichever project is processed last. So its entries are accumulated into modelIndexes here and
// the merged index.json for each model is written once at the end (writeMergedModelIndexes).
const mergeModelDirectories = (extractDir, modelIndexes) => {
  const entries = fs.readdirSync(extractDir, { withFileTypes: true });

  entries.forEach((entry) => {
    if (!entry.isDirectory()) return;

    const modelKey = entry.name;
    fs.cpSync(path.join(extractDir, modelKey), path.join(DATA_DIR, modelKey), {
      recursive: true,
      force: true
    });

    const indexPath = path.join(extractDir, modelKey, 'index.json');
    if (!fs.existsSync(indexPath)) return;

    const records = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))[modelKey] || [];
    modelIndexes[modelKey] ||= new Map();
    records.forEach((record) => modelIndexes[modelKey].set(record.uuid, record));
  });
};

const writeMergedDescriptors = (descriptors) => {
  const filePath = path.join(DATA_DIR, 'descriptors.json');
  fs.writeFileSync(filePath, JSON.stringify({ descriptors: [...descriptors.values()] }, null, 2));
};

const writeMergedResourceIds = (resourceIds) => {
  const filePath = path.join(DATA_DIR, 'resources.json');
  fs.writeFileSync(filePath, JSON.stringify({ resource_ids: [...resourceIds] }, null, 2));
};

const writeMergedModelIndexes = (modelIndexes) => {
  Object.entries(modelIndexes).forEach(([modelKey, recordsByUuid]) => {
    const records = [...recordsByUuid.values()];
    const filePath = path.join(DATA_DIR, modelKey, 'index.json');
    fs.writeFileSync(filePath, JSON.stringify({ [modelKey]: records, list: { count: records.length } }, null, 2));
  });
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
