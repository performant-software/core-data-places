# Static Build Pipeline

An automated, end-to-end pipeline that exports a project's Core Data content, generates its IIIF
level 0 static image assets, optionally builds static map layers, builds the Astro site entirely
from those exported files (no network access to Core Data during the Astro build itself), and
uploads everything to a Cloudflare R2 bucket.

It's intended to be run from a script (locally, or in CI such as GitHub Actions) via:

```
npm run static-build
```

This is a different, newer mechanism than the older fully-manual process described in
[static-deploy.md](./static-deploy.md) (local build → zip → FTP transfer). This pipeline automates
every step, including generating IIIF static image assets (which the older doc does not cover at
all) and uploading directly to storage.

## What it does

1. **Exports project data.** Logs in to core-data-cloud with a service account, triggers a JSON
   export for each configured project ID (passing `base_url`, since generated manifests need it -
   see below), polls until the export job completes, downloads the resulting zip, and
   extracts/merges it into `api/` - the same directory the Astro content loaders
   (`src/loaders/coreData/`, `src/loaders/geometry/`) already read from.

   Alongside each record's own JSON, core-data-cloud also writes IIIF Presentation Manifests for
   that record's related media, one per relationship type, plus a Collection aggregating them
   (e.g. `events/<uuid>/manifests.json`, `events/<uuid>/<relationship_uuid>/manifest.json`). Their
   canvases reference the *static* image assets step 2 generates at `iiif/3/image/<uuid>/...`
   (unaffected by this - that path is unchanged), but the manifests themselves are written now,
   independent of whether those static assets exist yet.
2. **Generates static IIIF assets, builds static map layers, and builds the site, all in
   parallel.** These three steps have no dependency on each other - the Astro build only reads
   `api/` (written in step 1) and never touches the IIIF assets or map layers directly; they're
   baked into the built output only as root-relative URL strings (e.g. `/iiif/3/image/<uuid>/...`,
   `/_fds/maps/style.json`), resolved by a browser after deployment, not fetched or validated at
   build time. So they run concurrently:
   - **Static IIIF assets:** reads the list of iiif-cloud media resource UUIDs from the merged
     `api/resources.json`, sends them to iiif-cloud's `create_static_assets` endpoint
     (along with this run's own storage credentials - see [storage credentials](#storage-credentials)
     below), and polls until all of them are generated.
   - **Static map layers:** runs `npm run build:maps` (see `scripts/build.maps.mjs`), reading
     places from the `api/` tree written in step 1, to generate any configured Protomaps basemap
     and/or raster/GeoJSON overlays. See [Static map layers](#static-map-layers) below - this step
     is a no-op (not a failure) for a site with no layer configured for static builds.
   - **Astro build:** runs `npm run build` with `STATIC_BUILD=true`, so the Astro content
     collections are built entirely from the files written in step 1 - no further network calls to
     core-data-cloud for record data.

   If any of the three fails, the other two are terminated rather than left running to completion.
3. **Uploads to storage.** Once all of the above have succeeded, recursively uploads the built
   `dist/` directory to the storage bucket, under `destination`, and - if the static map layers
   step actually wrote anything - the map layers to `destination/_fds/maps/`.

## Static map layers

The static maps build (`npm run build:maps`, see `scripts/build.maps.mjs`) only generates output
for layers whose site config has a `static.url` set, matching the fixed upload path this script
uses (`/_fds/maps/...`, root-relative once deployed):

| Layer type | `static.url` |
|---|---|
| Basemap | `/_fds/maps/style.json` |
| Raster overlay | A tile template under `/_fds/maps/overlays/`, e.g. `/_fds/maps/overlays/historic/{z}/{x}/{y}.png` |
| GeoJSON overlay | A path under `/_fds/maps/overlays/`, e.g. `/_fds/maps/overlays/boundaries.geojson` |

See [static-deploy.md](./static-deploy.md) for the full table of static map layer config options.
A site with no layer configured this way isn't an error - this step simply produces nothing to
upload, and the rest of the pipeline proceeds normally.

Requires the `pmtiles` CLI (e.g. `brew install pmtiles`, or set `PMTILES_BIN` to a downloaded
binary) and `git` to be available on `PATH` wherever `npm run static-build` runs - both are used
to prepare the basemap tiles and fonts/sprites. See `npm run build:maps -- --help` for the full
set of options (world map source, work directory, size limits, etc.) this script doesn't expose
directly, relying on their defaults instead.

## Required destination alignment

Every upload **must** write to the same storage bucket, under the same `destination` prefix. The
built site's HTML/JSON references media at root-relative paths like
`/iiif/3/image/<uuid>/full/max/0/default.jpg` (see `src/loaders/coreData/helpers.ts`) and
`/_fds/maps/...`, so the IIIF image assets, static map layers, and the built site all need to be
reachable at the same origin and path prefix once deployed. This script already enforces this by
using one `destination` value, and one set of storage credentials, for every step - there's
nothing extra to configure, but it's worth understanding if you're debugging a deployed site where
images or maps don't load.

## Parameters

### `--project-ids` / `PROJECT_IDS`

One or more core-data-cloud project IDs, comma-separated (e.g. `--project-ids 91,108`). Optional -
if omitted, falls back to this site's own `core_data.project_ids` in `public/config.json`.

When more than one project ID is given, every project's data is merged into the same
`api/` tree (de-duplicated by record UUID), and all of their media resources are sent to
iiif-cloud together.

### `--base-url` / `BASE_URL`

**Required.** The base URL the deployed site (and its IIIF image assets) will be served from, e.g.
`https://my-site.example.com`. Passed to the core-data-cloud export (so generated manifest/collection
`id` fields are correct absolute URLs), to iiif-cloud (so generated `info.json`/manifest `id` fields
are correct absolute URLs), and to the Astro build as `PUBLIC_BASE_URL`.

### `--destination` / `DESTINATION`

**Required.** The shared storage key prefix both the IIIF static assets and the built site are
uploaded under, e.g. `sites/my-site`. See
[Required destination alignment](#required-destination-alignment).

### Core Data credentials (env only)

| Variable | Required | Description |
|---|---|---|
| `CORE_DATA_URL` | No | Overrides the core-data-cloud host; defaults to `core_data.url` in `public/config.json`. |
| `CORE_DATA_SERVICE_EMAIL` | Yes | Email for a core-data-cloud user account used to trigger/poll the export. An admin account is required, since exporting project data is an admin-only action. |
| `CORE_DATA_SERVICE_PASSWORD` | Yes | Password for the above account. |

### IIIF Cloud credentials (env only)

| Variable | Required | Description |
|---|---|---|
| `IIIF_CLOUD_URL` | Yes | Base URL of the iiif-cloud instance, e.g. `https://iiif.example.com`. |
| `IIIF_CLOUD_API_KEY` | Yes | API key for a iiif-cloud user account (required to call `create_static_assets`). |

### Storage credentials (env only)

| Variable | Required | Description |
|---|---|---|
| `STATIC_STORAGE_BUCKET` | Yes | Storage bucket name. |
| `STATIC_STORAGE_ACCESS_KEY_ID` | Yes | Storage access key ID. |
| `STATIC_STORAGE_SECRET_ACCESS_KEY` | Yes | Storage secret access key. |
| `STATIC_STORAGE_ENDPOINT` | Yes | S3-compatible endpoint URL for this script's own upload in step 3 (e.g. `https://<account-id>.r2.cloudflarestorage.com`). Not sent to iiif-cloud - see below. |

#### Storage credentials

The bucket/access key ID/secret access key are used for two things: this script's own upload of
the built site (step 3), and are also forwarded to iiif-cloud's `create_static_assets` call (step
2) so that iiif-cloud writes the IIIF static assets using *this run's own credentials* rather than
its own long-lived, bucket-wide credentials. This means you can (and should) mint a
narrowly-scoped, short-lived storage credential for each build - e.g. one limited to read/write
access under `destination` only - rather than giving every static build run (and iiif-cloud's own
environment) blanket access to the whole bucket. iiif-cloud requires this `storage` parameter on
every request and will reject the request outright if it's missing - there is no credential
fallback on iiif-cloud's side (its own `STATIC_STORAGE_*` environment variables, if configured, are
used only as a local-dev fallback for its own rake tasks, never for requests from this script).

`STATIC_STORAGE_ENDPOINT` is **not** included in what's sent to iiif-cloud: iiif-cloud fixes its
own storage endpoint/region server-side, so this script's endpoint must point at the same
account/endpoint iiif-cloud's deployment is configured for - only the bucket and credentials are
selectable per run.

### Polling (env only, optional)

| Variable | Default | Description |
|---|---|---|
| `STATIC_BUILD_POLL_INTERVAL_SECONDS` | `10` | How often to poll job status (both core-data-cloud and iiif-cloud). |
| `STATIC_BUILD_POLL_MAX_ATTEMPTS` | `360` | Maximum number of *consecutive polls with no progress* before giving up (default: 1 hour at the default interval if a job never moves at all). |

For the iiif-cloud static assets job, each poll that reports a different `completed_count +
failed_count` than the previous one resets this count rather than adding to it - so a large batch
that keeps making incremental progress can run well past `STATIC_BUILD_POLL_MAX_ATTEMPTS *
STATIC_BUILD_POLL_INTERVAL_SECONDS` in total, as long as it doesn't actually stall for that long at
a stretch. The core-data-cloud export job has no equivalent progress signal to key off (it's a
single job with no partial-completion count), so its poll simply counts every attempt as before.

## Example

Locally, with a `.env` file (picked up automatically) or exported shell variables:

```sh
PROJECT_IDS=91 \
CORE_DATA_SERVICE_EMAIL=static-build@example.com \
CORE_DATA_SERVICE_PASSWORD=*** \
IIIF_CLOUD_URL=https://iiif.example.com \
IIIF_CLOUD_API_KEY=*** \
STATIC_STORAGE_BUCKET=my-bucket \
STATIC_STORAGE_ACCESS_KEY_ID=*** \
STATIC_STORAGE_SECRET_ACCESS_KEY=*** \
STATIC_STORAGE_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com \
npm run static-build -- --base-url https://my-site.example.com --destination sites/my-site
```

In GitHub Actions, the same environment variables would typically come from repository/environment
secrets, with `PROJECT_IDS`/`--base-url`/`--destination` as workflow inputs.
