import { execFileSync, spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { parseArgs } from 'util';
import {
  BASEMAP_PATH,
  getExtractSize,
  getInputs,
  getStyle,
  STYLE_PATH,
  TILES_MAJOR_VERSION
} from './maps/inputs.mjs';

/**
 * Writes the files for static Protomaps basemap layers.
 * Matches layers where `static.url` is inside the passed base URL (e.g. `/_fds/maps/style.json` for the default
 * `/_fds/maps/` base URL); ensure config matches before running.
 */

const USAGE = `Usage: npm run build:maps -- [options]

  --export-dir <dir>         FairData export to read places from (default: FAIRDATA_EXPORT_DIR)
  --config <file>            Site config (default: public/config.json)
  --base-url <url>           URL the output is published at (default: /_fds/maps/)
  --out <dir>                Empty folder to write to
  --inputs-only              Print what the output depends on, without writing it
  --source <url|file>        Protomaps world map (default: PROTOMAPS_SOURCE, or the latest daily build)
  --work-dir <dir>           Folder for downloads (default: in the system temp folder)
  --max-basemap-size <MB>    Largest basemap to pull (default: 1000)`;

const DAILY_BUILDS = 'https://build.protomaps.com';
const ASSETS_REPOSITORY = 'https://github.com/protomaps/basemaps-assets.git';

const log = (message) => console.error(message);

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

const readPlaces = (exportDir) => {
  if (!exportDir) {
    return [];
  }

  const file = path.join(exportDir, 'api', 'places', 'index.json');

  if (!fs.existsSync(file)) {
    throw new Error(`${file} doesn't exist`);
  }

  return readJson(file).places || [];
};

const findLatestBuild = async () => {
  for (let daysAgo = 1; daysAgo <= 7; daysAgo += 1) {
    const date = new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10).replaceAll('-', '');
    const url = `${DAILY_BUILDS}/${date}.pmtiles`;
    const response = await fetch(url, { method: 'HEAD' }).catch(() => null);

    if (response?.ok) {
      return url;
    }
  }

  throw new Error(`No Protomaps build from the last seven days was found at ${DAILY_BUILDS}`);
};

const findPmtiles = () => {
  const command = process.env.PMTILES_BIN || 'pmtiles';

  if (spawnSync(command, ['version'], { stdio: 'ignore' }).error) {
    throw new Error('The pmtiles command is required: brew install pmtiles, or set PMTILES_BIN to a binary from https://github.com/protomaps/go-pmtiles/releases');
  }

  return command;
};

/**
 * Throws unless the world map's tile data is the version the style draws.
 */
const checkTilesVersion = (pmtiles, source) => {
  const result = spawnSync(pmtiles, ['show', source, '--metadata'], { encoding: 'utf8' });

  let version;

  try {
    ({ version } = JSON.parse(result.stdout));
  } catch {
    throw new Error(`${source} doesn't look like a Protomaps world map: ${(result.stderr || '').trim()}`);
  }

  if (Number(String(version).split('.')[0]) !== TILES_MAJOR_VERSION) {
    throw new Error(`${source} has version ${version} tile data, but the style needs version ${TILES_MAJOR_VERSION}. Pass an older --source, or update @protomaps/basemaps.`);
  }
};

/**
 * Throws if the basemap would be larger than the limit, before downloading it.
 */
const checkBasemapSize = (pmtiles, extractArgs, maxSize) => {
  const result = spawnSync(pmtiles, [...extractArgs, '--dry-run'], { encoding: 'utf8' });
  const size = getExtractSize(`${result.stdout}\n${result.stderr}`);

  if (size === null) {
    log('Couldn\'t estimate the basemap\'s size.');
    return;
  }

  const megabytes = Math.round(size / 1e6);

  if (megabytes > maxSize) {
    throw new Error(`The basemap would be ${megabytes} MB, more than --max-basemap-size (${maxSize}). Lower static.maxzoom or set a smaller static.bbox.`);
  }

  log(`The basemap will be about ${megabytes} MB.`);
};

/**
 * Returns a sparse clone of protomaps/basemaps-assets with the passed fonts and the sprites.
 */
const getAssets = (workDir, fonts) => {
  const dir = path.join(workDir, 'basemaps-assets');

  if (!fs.existsSync(dir)) {
    execFileSync('git', ['clone', '--depth', '1', '--filter=blob:none', '--sparse', ASSETS_REPOSITORY, dir], { stdio: 'ignore' });
  }

  execFileSync('git', ['-C', dir, 'sparse-checkout', 'set', ...fonts.map((font) => `fonts/${font}`), 'sprites/v4'], { stdio: 'ignore' });

  return dir;
};

const writeBasemap = async (basemap, baseUrl, options) => {
  const { out, workDir } = options;

  const pmtiles = findPmtiles();
  const source = options.source || process.env.PROTOMAPS_SOURCE || await findLatestBuild();

  checkTilesVersion(pmtiles, source);

  const extractArgs = [
    'extract',
    source,
    path.join(out, BASEMAP_PATH),
    `--bbox=${basemap.bbox.join(',')}`,
    `--maxzoom=${basemap.maxzoom}`
  ];

  checkBasemapSize(pmtiles, extractArgs, options.maxBasemapSize);

  log(`Pulling the basemap from ${source}...`);
  execFileSync(pmtiles, extractArgs, { stdio: 'ignore' });

  const { style, fonts } = getStyle(basemap, baseUrl);
  fs.writeFileSync(path.join(out, STYLE_PATH), JSON.stringify(style));

  log('Copying fonts and sprites...');
  const assets = getAssets(workDir, fonts);

  for (const font of fonts) {
    fs.cpSync(path.join(assets, 'fonts', font), path.join(out, 'fonts', font), { recursive: true });
  }

  const sprites = path.join(assets, 'sprites', 'v4');
  const isFlavor = (name) => name.startsWith(`${basemap.flavor}.`) || name.startsWith(`${basemap.flavor}@`);

  for (const file of fs.readdirSync(sprites).filter(isFlavor)) {
    fs.cpSync(path.join(sprites, file), path.join(out, 'sprites', 'v4', file));
  }
};

(async function() {
  try { process.loadEnvFile() } catch {};

  const { values: args } = parseArgs({
    options: {
      'export-dir': { type: 'string' },
      config: { type: 'string', default: 'public/config.json' },
      'base-url': { type: 'string', default: '/_fds/maps/' },
      out: { type: 'string' },
      'inputs-only': { type: 'boolean', default: false },
      source: { type: 'string' },
      'work-dir': { type: 'string', default: path.join(os.tmpdir(), 'core-data-places-maps') },
      'max-basemap-size': { type: 'string', default: '1000' },
      help: { type: 'boolean', default: false }
    }
  });

  if (args.help) {
    console.log(USAGE);
    return;
  }

  try {
    const config = readJson(args.config);
    const places = readPlaces(args['export-dir'] || process.env.FAIRDATA_EXPORT_DIR);
    const inputs = getInputs(config, places, { baseUrl: args['base-url'] });

    if (args['inputs-only']) {
      console.log(JSON.stringify(inputs, null, 2));
      return;
    }

    if (!args.out) {
      throw new Error('--out is required');
    }

    if (fs.existsSync(args.out) && fs.readdirSync(args.out).length > 0) {
      throw new Error(`${args.out} isn't empty`);
    }

    const options = {
      out: args.out,
      source: args.source,
      workDir: args['work-dir'],
      maxBasemapSize: Number(args['max-basemap-size'])
    };

    if (!inputs.basemap) {
      log(`No vector layer has a static.url of ${inputs.base_url}${STYLE_PATH}.`);
      return;
    }

    fs.mkdirSync(options.out, { recursive: true });
    fs.mkdirSync(options.workDir, { recursive: true });

    await writeBasemap(inputs.basemap, inputs.base_url, options);

    log(`Done. ${args.out} must be served at ${inputs.base_url}`);
  } catch (error) {
    log(error.message);
    process.exitCode = 1;
  }
}());
