import { spawn } from 'child_process';
import { resolveConfig } from './staticBuild.config.mjs';
import { exportProjectData } from './staticBuild.coreData.mjs';
import { generateStaticAssets } from './staticBuild.iiifCloud.mjs';
import { buildStaticMaps, hasStaticMaps, UPLOAD_PREFIX as MAPS_UPLOAD_PREFIX } from './staticBuild.maps.mjs';
import { uploadDirectory } from './staticBuild.storage.mjs';

// Spawned detached (its own process group) so that if either other concurrent step (generating
// static assets, building static map layers) fails first, the whole build subprocess tree
// (npm -> astro/tinacms) can be killed as a group via killAstroBuild below - a plain child.kill()
// only signals the top npm process and can leave its own child processes running as orphans.
let astroBuildChild = null;

const runAstroBuild = (config) => new Promise((resolve, reject) => {
  astroBuildChild = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    detached: true,
    env: {
      ...process.env,
      STATIC_BUILD: 'true',
      PUBLIC_BASE_URL: config.baseUrl
    }
  });

  astroBuildChild.on('error', reject);
  astroBuildChild.on('exit', (code) => {
    astroBuildChild = null;
    if (code === 0) {
      resolve();
    } else {
      reject(new Error(`Astro build exited with code ${code}`));
    }
  });
});

const killAstroBuild = () => {
  if (!astroBuildChild) return;

  console.error('Terminating the still-running Astro build...');
  try {
    process.kill(-astroBuildChild.pid, 'SIGTERM');
  } catch {
    // Already exited between the check above and here - nothing to do.
  }
};

(async function () {
  try { process.loadEnvFile(); } catch {}

  const config = await resolveConfig();

  console.info(`Starting static build for project(s): ${config.projectIds.join(', ')}`);

  console.info('Step 1: Exporting project data from core-data-cloud...');
  const resourceIds = await exportProjectData(config);

  // Generating static assets, building static map layers, and building the Astro site are all
  // independent of each other - the Astro build only reads the files step 1 already wrote to
  // api/, and never touches the IIIF assets or map layers directly (they're referenced in the
  // built output only as root-relative URL strings, resolved by a browser after deployment, not
  // fetched or validated at build time). Running them concurrently costs little: the only
  // CPU/memory-heavy work here is the Astro build itself; the other two are either a
  // network-polling loop (IIIF assets are generated on iiif-cloud's own workers) or a short,
  // separate CLI process (static maps).
  console.info('Step 2: Generating static IIIF assets, building static map layers, and building the Astro site in parallel...');
  let mapsDir;
  try {
    [, mapsDir] = await Promise.all([
      generateStaticAssets(config, resourceIds),
      buildStaticMaps(config),
      runAstroBuild(config)
    ]);
  } catch (error) {
    killAstroBuild();
    throw error;
  }

  console.info('Step 3: Uploading the built site to storage...');
  await uploadDirectory(config, 'dist');

  if (hasStaticMaps(mapsDir)) {
    console.info('Step 4: Uploading static map layers to storage...');
    await uploadDirectory(config, mapsDir, MAPS_UPLOAD_PREFIX);
  } else {
    console.info('No static map layers configured for this site, skipping their upload.');
  }

  console.info('Static build complete.');
}()).catch((error) => {
  console.error(error);
  process.exit(1);
});

