# Static Build Pipeline

An automated, end-to-end pipeline that exports a project's Core Data content, generates its IIIF
level 0 static image assets, builds the Astro site entirely from those exported files (no network
access to Core Data during the Astro build itself), and uploads everything to a Cloudflare R2
bucket.

It's intended to be run from a script (locally, or in CI such as GitHub Actions) via:

```
npm run static-build
```

This is a different, newer mechanism than the older fully-manual process described in
[static-deploy.md](./static-deploy.md) (local build → zip → FTP transfer). This pipeline automates
every step, including generating IIIF static image assets (which the older doc does not cover at
all) and uploading directly to R2.

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
2. **Generates static IIIF assets and builds the site, in parallel.** These two steps have no
   dependency on each other - the Astro build only reads `api/` (written in step 1) and
   never touches the IIIF assets directly; they're baked into the built output only as
   root-relative URL strings (e.g. `/iiif/3/image/<uuid>/...`), resolved by a browser after
   deployment, not fetched or validated at build time. So they run concurrently:
   - **Static IIIF assets:** reads the list of iiif-cloud media resource UUIDs from the merged
     `api/resources.json`, sends them to iiif-cloud's `create_static_assets` endpoint
     (along with this run's own R2 credentials - see [R2 credentials](#r2-credentials) below), and
     polls until all of them are generated.
   - **Astro build:** runs `npm run build` with `STATIC_BUILD=true`, so the Astro content
     collections are built entirely from the files written in step 1 - no further network calls to
     core-data-cloud for record data.

   If either fails, the other is terminated rather than left running to completion.
3. **Uploads to R2.** Once both of the above have succeeded, recursively uploads the built `dist/`
   directory to the R2 bucket, under `destination`.

## Required destination alignment

Steps 2 and 3 **must** write to the same R2 bucket, under the same `destination` prefix. The
built site's HTML/JSON references media at root-relative paths like
`/iiif/3/image/<uuid>/full/max/0/default.jpg` (see `src/loaders/coreData/helpers.ts`), so the IIIF
image assets and the built site need to be reachable at the same origin and path prefix once
deployed. This script already enforces this by using one `destination` value, and one set of R2
credentials, for both steps - there's nothing extra to configure, but it's worth understanding if
you're debugging a deployed site where images don't load.

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

**Required.** The shared R2 key prefix both the IIIF static assets and the built site are uploaded
under, e.g. `sites/my-site`. See [Required destination alignment](#required-destination-alignment).

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
| `IIIF_CLOUD_API_KEY` | Yes | API key for an admin iiif-cloud user account (required to call `create_static_assets`). |

### R2 credentials (env only)

| Variable | Required | Description |
|---|---|---|
| `R2_BUCKET` | Yes | R2 bucket name. |
| `R2_ACCESS_KEY_ID` | Yes | R2 access key ID. |
| `R2_SECRET_ACCESS_KEY` | Yes | R2 secret access key. |
| `R2_ENDPOINT` | Yes | R2 S3-compatible endpoint URL. |

#### R2 credentials

These credentials are used for two things: this script's own upload of the built site (step 3),
and are also forwarded to iiif-cloud's `create_static_assets` call (step 2) so that iiif-cloud
writes the IIIF static assets using *this run's own credentials* rather than its own long-lived,
bucket-wide R2 credentials. This means you can (and should) mint a narrowly-scoped, short-lived R2
credential for each build - e.g. one limited to read/write access under `destination` only - rather
than giving every static build run (and iiif-cloud's own environment) blanket access to the whole
bucket. iiif-cloud falls back to its own environment-configured R2 credentials only if this `r2`
parameter is omitted entirely from the request, which this script never does.

### Polling (env only, optional)

| Variable | Default | Description |
|---|---|---|
| `STATIC_BUILD_POLL_INTERVAL_SECONDS` | `10` | How often to poll job status (both core-data-cloud and iiif-cloud). |
| `STATIC_BUILD_POLL_MAX_ATTEMPTS` | `360` | Maximum number of polls before giving up (default: 1 hour at the default interval). |

## Example

Locally, with a `.env` file (picked up automatically) or exported shell variables:

```sh
PROJECT_IDS=91 \
CORE_DATA_SERVICE_EMAIL=static-build@example.com \
CORE_DATA_SERVICE_PASSWORD=*** \
IIIF_CLOUD_URL=https://iiif.example.com \
IIIF_CLOUD_API_KEY=*** \
R2_BUCKET=my-bucket \
R2_ACCESS_KEY_ID=*** \
R2_SECRET_ACCESS_KEY=*** \
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com \
npm run static-build -- --base-url https://my-site.example.com --destination sites/my-site
```

In GitHub Actions, the same environment variables would typically come from repository/environment
secrets, with `PROJECT_IDS`/`--base-url`/`--destination` as workflow inputs.
