## Static Deploy

Follow the instructions below to build a static version of a site to host on GitHub Pages, Reclaim Hosting, AWS, etc. The steps will include instructions for building the site on a local development machine and uploading the assets to a static hosting service.

#### Core Data on Heroku

For Core Data applications hosted on Heroku, it may be advisable to scale the dyno infrastructure, either by upgrading the web dynos and/or adding more dynos.

#### 1. Build

From `/path/to/core-data-places` run the following:

```
npm install && npm run build
```

This command will install all node dependencies, and build the AstroJS site. The time required to build the site will be directly proportional to the amount of data contained in the Core Data project as it will:
- Fetch all of the records from Core Data to store in the Astro Content Layer
- Build static pages and API endpoints for each of the records

Build times can also be affected by the number of content records (paths, posts, pages, etc) added to TinaCMS, but this will likely be trivial compared to the number of Core Data records.

#### 2. Compress

After building has completed, assets will be exported to the `/dist` directory. Use a compression utility to zip the contents of the directory.

#### 3. Transfer

Using a FTP/SFTP service, transfer compressed assets to the static hosting platform.

#### 4. Extract

Extract the contents of the compressed assets to the root path of the webserver.