import fs from 'fs';
import { spawn } from 'child_process';

const OUTPUT_DIR = '.static-maps';

// Root-relative prefix every layer's static.url is expected to live under (see build.maps.mjs's
// own --base-url default) - also where the built output is uploaded to under `destination`, so
// the two agree without either side needing to be told the other's value.
export const UPLOAD_PREFIX = '_fds/maps';

/**
 * Runs `npm run build:maps` (see scripts/build.maps.mjs) to write any configured static map
 * layers - a Protomaps basemap and/or raster/GeoJSON overlays - reading places from the `api/`
 * tree step 1 already wrote. Writes into its own folder rather than `dist/`, since the Astro
 * build (running concurrently with this) clears `dist/` when it starts.
 *
 * A site with no layer's `static.url` configured for static builds (see
 * docs/static-build-pipeline.md) isn't an error - build:maps simply writes nothing, leaving
 * OUTPUT_DIR empty; callers should treat an empty result as "nothing to upload", not a failure.
 *
 * @param {Object} config - see staticBuild.config.mjs#resolveConfig
 * @returns {Promise<string>} the directory written to (possibly empty)
 */
export const buildStaticMaps = (config) => new Promise((resolve, reject) => {
  // build:maps itself refuses to write into a non-empty --out, so clear out anything left behind
  // by a previous failed run.
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });

  const child = spawn('npm', ['run', 'build:maps', '--', '--export-dir', '.', '--out', OUTPUT_DIR], {
    stdio: 'inherit',
    env: { ...process.env }
  });

  child.on('error', reject);
  child.on('exit', (code) => {
    if (code === 0) {
      resolve(OUTPUT_DIR);
    } else {
      reject(new Error(`Static maps build exited with code ${code}`));
    }
  });
});

/**
 * Whether buildStaticMaps actually wrote anything - false for a site with no layer's static.url
 * configured, in which case there's nothing to upload.
 */
export const hasStaticMaps = (dir) => fs.existsSync(dir) && fs.readdirSync(dir).length > 0;
