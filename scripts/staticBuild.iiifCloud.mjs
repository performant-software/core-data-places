/**
 * Sends the merged resource_ids list to iiif-cloud's create_static_assets endpoint, passing along
 * this run's own R2 credentials (minted narrowly for this run, rather than relying on iiif-cloud's
 * own blanket-access, long-lived R2 credentials), and polls until the static assets are done.
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
      r2: {
        bucket: config.r2.bucket,
        access_key_id: config.r2.accessKeyId,
        secret_access_key: config.r2.secretAccessKey,
        endpoint: config.r2.endpoint
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

const pollJob = async (config, jobUuid) => {
  for (let attempt = 0; attempt < config.pollMaxAttempts; attempt += 1) {
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

    console.info(`[iiif-cloud] Job ${jobUuid} status: ${job.status} (${job.completed_count + job.failed_count}/${job.total_count}, attempt ${attempt + 1}/${config.pollMaxAttempts})`);
    await sleep(config.pollIntervalMs);
  }

  throw new Error(`Timed out waiting for iiif-cloud job ${jobUuid} to complete`);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
