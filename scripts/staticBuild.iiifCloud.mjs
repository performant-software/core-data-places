/**
 * Sends the merged resource_ids list to iiif-cloud's create_static_assets endpoint, passing along
 * this run's own storage credentials (minted narrowly for this run, rather than relying on
 * iiif-cloud's own blanket-access, long-lived credentials), and polls until the static assets are
 * done.
 *
 * Only bucket/access_key_id/secret_access_key are sent - iiif-cloud fixes its storage
 * endpoint/region server-side and no longer accepts them per-request, so config.storage.endpoint
 * (used locally by staticBuild.storage.mjs for the Astro build upload) is intentionally omitted
 * here.
 *
 * @param {Object} config - see staticBuild.config.mjs#resolveConfig
 * @param {string[]} resourceIds
 */
export const generateStaticAssets = async (config, resourceIds) => {
  if (resourceIds.length === 0) {
    console.info('[iiif-cloud] No media resources to generate static assets for, skipping.');
    return;
  }

  console.info(`[iiif-cloud] Requesting static assets for ${resourceIds.length} resource(s)...`);

  const response = await fetch(`${config.iiifCloudUrl}/public/resources/create_static_assets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': config.iiifCloudApiKey
    },
    body: JSON.stringify({
      resource_ids: resourceIds,
      base_url: config.baseUrl,
      destination: config.destination,
      storage: {
        bucket: config.storage.bucket,
        access_key_id: config.storage.accessKeyId,
        secret_access_key: config.storage.secretAccessKey
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to request static assets (${response.status}): ${await response.text()}`);
  }

  const { job_uuid: jobUuid, errors } = await response.json();
  if (errors?.length > 0) {
    throw new Error(`iiif-cloud rejected the static assets request: ${JSON.stringify(errors)}`);
  }

  await pollJob(config, jobUuid);

  console.info('[iiif-cloud] Static assets generated.');
};

// pollMaxAttempts bounds consecutive polls with *no observed progress*, not the job's total
// wall-clock running time - large projects can take far longer than pollMaxAttempts *
// pollIntervalMs to finish, as long as more resources keep completing/failing along the way
// (iiif-cloud's own GenerateStaticAssetsJob uses the same reset-on-progress approach). Each time
// completed_count + failed_count moves, that's confirmation iiif-cloud is still actively working
// through the batch, so the attempt count resets instead of accumulating toward a timeout that's
// only meant to catch a job that's actually stalled.
const pollJob = async (config, jobUuid) => {
  let attempt = 0;
  let lastProgress = null;

  while (attempt < config.pollMaxAttempts) {
    const response = await fetch(`${config.iiifCloudUrl}/public/jobs/${jobUuid}`, {
      headers: { 'X-API-KEY': config.iiifCloudApiKey }
    });

    if (!response.ok) {
      throw new Error(`Failed to check status of iiif-cloud job ${jobUuid} (${response.status}): ${await response.text()}`);
    }

    const job = await response.json();
    if (job.status === 'completed') {
      return job;
    }
    if (job.status === 'failed') {
      throw new Error(`iiif-cloud job ${jobUuid} failed (${job.failed_count}/${job.total_count} resource(s) failed)`);
    }

    const progress = job.completed_count + job.failed_count;
    attempt = progress === lastProgress ? attempt + 1 : 0;
    lastProgress = progress;

    console.info(`[iiif-cloud] Job ${jobUuid} status: ${job.status} (${progress}/${job.total_count}, ${attempt}/${config.pollMaxAttempts} attempts with no further progress)`);
    await sleep(config.pollIntervalMs);
  }

  throw new Error(`Timed out waiting for iiif-cloud job ${jobUuid} to make further progress`);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
