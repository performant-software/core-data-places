import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import mime from 'mime-types';

/**
 * Recursively uploads every file under sourceDir to the storage bucket, keyed under destination,
 * preserving the directory structure relative to sourceDir. Uses the same bucket/credentials
 * this run sent to iiif-cloud for its static assets (endpoint/region aside - iiif-cloud now fixes
 * those server-side rather than accepting them per-request), so the Astro build output ends up
 * alongside the IIIF image assets under one shared prefix (both reachable at the site's own
 * base_url).
 *
 * @param {Object} config - see staticBuild.config.mjs#resolveConfig
 * @param {string} sourceDir - local directory to upload (e.g. "dist")
 * @param {string} keyPrefix - optional sub-path under destination to upload into (e.g.
 *   "_fds/maps" for the static maps build), rather than directly under destination itself
 */
export const uploadDirectory = async (config, sourceDir, keyPrefix = '') => {
  const client = new S3Client({
    region: 'auto',
    endpoint: config.storage.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.storage.accessKeyId,
      secretAccessKey: config.storage.secretAccessKey
    }
  });

  const filePaths = listFiles(sourceDir);
  console.info(`[storage] Uploading ${filePaths.length} file(s) from ${sourceDir} to ${config.destination}...`);

  for (const filePath of filePaths) {
    const relativePath = path.relative(sourceDir, filePath);
    const key = path.posix.join(config.destination, keyPrefix, ...relativePath.split(path.sep));

    await client.send(new PutObjectCommand({
      Bucket: config.storage.bucket,
      Key: key,
      Body: fs.readFileSync(filePath),
      ContentType: mime.lookup(filePath) || 'application/octet-stream'
    }));
  }

  console.info('[storage] Upload complete.');
};

const listFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
};
