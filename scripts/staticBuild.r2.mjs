import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import mime from 'mime-types';

/**
 * Recursively uploads every file under sourceDir to the R2 bucket, keyed under destination,
 * preserving the directory structure relative to sourceDir. Uses the same bucket/credentials
 * this run sent to iiif-cloud for its static assets, so the Astro build output ends up alongside
 * the IIIF image assets under one shared prefix (both reachable at the site's own base_url).
 *
 * @param {Object} config - see staticBuild.config.mjs#resolveConfig
 * @param {string} sourceDir - local directory to upload (e.g. "dist")
 */
export const uploadDirectory = async (config, sourceDir) => {
  const client = new S3Client({
    region: 'auto',
    endpoint: config.r2.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.r2.accessKeyId,
      secretAccessKey: config.r2.secretAccessKey
    }
  });

  const filePaths = listFiles(sourceDir);
  console.info(`[r2] Uploading ${filePaths.length} file(s) from ${sourceDir} to ${config.destination}...`);

  for (const filePath of filePaths) {
    const relativePath = path.relative(sourceDir, filePath);
    const key = path.posix.join(config.destination, ...relativePath.split(path.sep));

    await client.send(new PutObjectCommand({
      Bucket: config.r2.bucket,
      Key: key,
      Body: fs.readFileSync(filePath),
      ContentType: mime.lookup(filePath) || 'application/octet-stream'
    }));
  }

  console.info('[r2] Upload complete.');
};

const listFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
};
