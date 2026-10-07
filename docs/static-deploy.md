## Static Deploy

Follow the instructions below to build a static version of a site to host on GitHub Pages, Reclaim Hosting, AWS, etc. The steps will include instructions for building the site on a local development machine and uploading the assets to a static hosting service.

#### FairData on Heroku

For FairData applications hosted on Heroku, it may be advisable to scale the dyno infrastructure, either by upgrading the web dynos and/or adding more dynos.

#### 1. Build

From `/path/to/core-data-places` run the following:

```
npm install && npm run build
```

This command will install all node dependencies, and build the AstroJS site. The time required to build the site will be directly proportional to the amount of data contained in the FairData project as it will:
- Fetch all of the records from FairData to store in the Astro Content Layer
- Build static pages and API endpoints for each of the records

Build times can also be affected by the number of content records (paths, posts, pages, etc) added to TinaCMS, but this will likely be trivial compared to the number of FairData records.

#### 2. Static maps

A static build can optionally serve its own basemap instead of using a live service such as MapTiler.

Set the layer's `static.url` of the basemap's `vector` layer (see [layers](configuration-schema.md#static)) to `/_fds/maps/style.json`. Then, to generate a static PMTiles basemap, ensure you have [pmtiles](https://github.com/protomaps/go-pmtiles) installed (`brew install pmtiles` on Mac), and run:

```sh
npm run build:maps -- --export-dir /path/to/export --out dist/_fds/maps
```

The basemap is pulled from the [Protomaps](https://protomaps.com) world map. It covers the area around the places in a FairData JSON export (`--export-dir`), or the layer's `static.bbox` if set, in which case no export is needed. Run `npm run build:maps -- --help` for more options.

The web server must support HTTP range requests to serve the `.pmtiles` file (storage buckets like R2 and S3 typically do).

#### 3. Compress

After building has completed, assets will be exported to the `/dist` directory. Use a compression utility to zip the contents of the directory.

#### 4. Transfer

Using a FTP/SFTP service, transfer compressed assets to the static hosting platform.

#### 5. Extract

Extract the contents of the compressed assets to the root path of the webserver.
