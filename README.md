# core-data-places

A map-centric website backed by a Core Data project.

## Getting Started

#### Requirements
- Node 20.x
- Netlify CLI
- Core Data Project
- Typesense Index

#### Environment variables

Copy the `.env.example` file to `.env` and enter required variables. For a local development setup, set `TINA_PUBLIC_IS_LOCAL` to "true" and `TINA_LOCAL_CONTENT_PATH` to "../"

#### Configuration

Add a `/public/config.dev.json` file, which will be ignored by Git, to copy local config settings when starting the application. Use the `config.json` table below to configure your project.

To start, run:
```
npm install && netlify dev
```

**Note:** Do not commit any project specific changes to `/public/config.json` in this repository.

**Note:** Changes to `config.json` will require a re-build of the site.

## Deploy to Production

#### Create a content repository

On GitHub, create a new content repository. The posts, paths, and pages records you create will be stored here, as well as any i18n, your project configuration, and default user accounts. 

###### Directory Structure

Create a directory structure in the content repository as follows. The actual files are just examples, we'll go over adding required files in the next sections.

```
content
├── branding
│   ├── branding.json
├── i18n
│   ├── en.json
├── pages
│   ├── Home.mdx
├── paths
│   ├── MyPath.mdx
│   ├── AnotherPath.mdx
├── posts
│   ├── FirstPost.mdx
│   ├── SecondPost.mdx
├── settings
│   ├── config.json
├── users
│   ├── index.json
```

###### Users

Copy the `/data/users.json` file into your content repository to `/content/users/index.json`. This will seed TinaCMS with the initial set of user accounts, which can be used to setup accounts for other users, then removed. Skip this step if you are using an SSO provider or institutional IdP to manage users instead.

###### Branding

Create the following `/content/branding/branding.json` file:

```json
{
  "title": "My Awesome Project",
  "footer": {
    "allow_login": true
  }
}
```

The `title` attribute will be set as the `<title>` element of the HTML page. Setting `footer.allow_login` to true will add Core Data and TinaCMS login buttons to the content footer. Additional branding options can be configured via TinaCMS.

###### Configuration

Copy the `/public/config.json` file into your content repository to `/content/settings/config.json` and adjust the configuration as desired.

| Key                                    | Type    | Description                                                                                                                                                                        |
|----------------------------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| content                                | Object  | TinaCMS content collections configuration                                                                                                                                          |
| content.collections                    | Array   | Array of content keys to allow for data entry and routing: "posts", "paths"                                                                                                        |
| content.localize_pages                 | Boolean | If `true` pages content will be pulled from a locale directory (e.g. `/en/My-Awesome-Page.mdx`)                                                                                    |
| core_data                              | Object  | Core Data configuration                                                                                                                                                            |
| core_data.url                          | String  | URL of the Core Data application                                                                                                                                                   |
| core_data.project_ids                  | Array   | Array of Core Data project IDs as strings                                                                                                                                          |
| detail_pages                           | Array   | Array of model names for which to build detail pages (e.g "places", "people", etc)                                                                                                 |
| i18n                                   | Object  | Astro i18n configuration                                                                                                                                                           |
| i18n.default_locale                    | String  | The default locale                                                                                                                                                                 |
| i18n.locales                           | Array   | A list of all available locales                                                                                                                                                    |
| layers                                 | Array   | A list of available map layers                                                                                                                                                     |
| layers.name                            | String  | The name of the map layer to display in the UI                                                                                                                                     |
| layers.layer_type                      | String  | Map layer type: "raster", "vector", "geojson" or "georeference"                                                                                                                    |
| layers.url                             | String  | URL to the map server                                                                                                                                                              |
| layers.overlay                         | Boolean | If `true`, map layer will be rendered as overlay layer. If `false`, map layer will be rendered as base layer                                                                       |
| result_filtering                       | Object  | Lists of fields and relationships to exclude per model.                                                                                                                            |
| result_filtering.events.exclude        | Array   | List of attributes, user defined fields and associations to be excluded from the search detail panel and detail pages. See [Search detail filtering](search-detail-filtering.md)   |
| result_filtering.instances.exclude     | Array   | List of attributes, user defined fields and associations to be excluded from the search detail panel and detail pages. See [Search detail filtering](search-detail-filtering.md)   |                     
| result_filtering.items.exclude         | Array   | List of attributes, user defined fields and associations to be excluded from the search detail panel and detail pages. See [Search detail filtering](search-detail-filtering.md)   |
| result_filtering.organizations.exclude | Array   | List of attributes, user defined fields and associations to be excluded from the search detail panel and detail pages. See [Search detail filtering](search-detail-filtering.md)   |                    
| result_filtering.people.exclude        | Array   | List of attributes, user defined fields and associations to be excluded from the search detail panel and detail pages. See [Search detail filtering](search-detail-filtering.md)   |                   
| result_filtering.places.exclude        | Array   | List of attributes, user defined fields and associations to be excluded from the search detail panel and detail pages. See [Search detail filtering](search-detail-filtering.md)   |                  
| result_filtering.works.exclude         | Array   | List of attributes, user defined fields and associations to be excluded from the search detail panel and detail pages. See [Search detail filtering](search-detail-filtering.md)   |
| search                                 | Array   | Search UI configuration                                                                                                                                                            |
| search.facets                          | Array   | Search facets configuration.                                                                                                                                                       |
| search.facets.icon                     | String  | Icon to display in the facet header                                                                                                                                                |
| search.facets.name                     | String  | Name of the facet field as defined in Typesense                                                                                                                                    |
| search.facets.type                     | String  | Search facet type: "list" or "select"                                                                                                                                              |
| search.geosearch                       | Boolean | If `true`, the "filter by map bounds" facet will be available in the map interface.                                                                                                |
| search.map                             | Object  | Map configuration                                                                                                                                                                  |
| search.map.cluster_radius              | Number  | If provided, map points will be clustered for the given radius (in miles). This option is only valid if the `map.geometry` property contains Lat/Lng coordinates.                  |
| search.map.geometry                    | String  | Path to the attribute in the Typesense document that contains the GeoJSON data to be displayed on the map                                                                          |
| search.map.max_zoom                    | Number  | The maximum zoom level to allow when the map view transitions to a set of bounds (a single place, or mulitple places).                                                             |
| search.map.zoom_to_place               | Boolean | If `true` or not specified, clicking on an individual place marker or search result will zoom the map to its location (using the max zoom).                                        |
| search.name                            | String  | The name of the search index configuration.                                                                                                                                        |
| search.result_card                     | Object  | Search result card configuration                                                                                                                                                   |
| search.result_card.title               | String  | Path to the value in the Typesense document that should be used as the card title. This value can contain nested objects (e.g. `<relationship-id>.0.name`).                        |
| search.result_card.attributes          | Array   | Attributes to display in the search list and table                                                                                                                                 |
| search.result_card.attributes.name     | String  | Path to the value in the Typesense document that should be used to look up the column value. This value can contain nested objects (e.g. `<relationship-id>.0.name`).              |
| search.result_card.attributes.icon     | String  | Name of the icon that should displayed next to the value in the search list. If not provided, a bullet point will be used.                                                         |
| search.route                           | String  | The navigation route to use when clicking on a search result card (e.g. "/places", "/organizations", etc)                                                                          |
| search.table                           | Boolean | If `false`, will suppress the table view for search results                                                                                                                        |
| search.timeline                        | Object  | Timeline configuration                                                                                                                                                             |
| search.timeline.date_range_facet       | String  | Path to the date range facet field in the Typesense document that will be used as the basis for the timeline. Required for the timeline to appear.                                 |
| search.timeline.event_path             | String  | Path to the event relation in the Typesense document. Required only if Event is not the primary model of this search index configuration.                                          |
| search.typesense                       | Object  | Typesense index connection information                                                                                                                                             |
| search.typesense.host                  | String  | Typesense host URL                                                                                                                                                                 |
| search.typesense.port                  | Number  | Typesense host port                                                                                                                                                                |
| search.typesense.protocol              | String  | Typesense host protocol. Typically "https" or "http"                                                                                                                               |
| search.typesense.api_key               | String  | Typesense search API key. **NOTE:** This should be a read-only key.                                                                                                                |
| search.typesense.index_name            | String  | Name of the Typesense collection                                                                                                                                                   |
| search.typesense.query_by              | String  | Typesense attributes to query when a search is executed                                                                                                                            |
| search.typesense.default_sort          | String  | Typesense attribute to sort by when no search is entered or as a tiebreaker. Search relevance score will always take priority over this attribute.                                 |
| search.typesense.exclude_fields        | String  | Fields to exclude from the Typesense search response                                                                                                                               |
| search.typesense.facets                | Object  | Facet configuration                                                                                                                                                                |
| search.typesense.facets.exclude        | Array   | Array of facet names to exclude                                                                                                                                                    |
| search.typesense.facets.include        | Array   | Array of facet names to include                                                                                                                                                    |
| search.typesense.overrides             | Object  | Overrides for the [typesense-instantsearch-adapter](https://github.com/typesense/typesense-instantsearch-adapter).                                                                 |

See [Configuration Schema](docs/configuration-schema.md) for more detailed information.

###### Create a new Personal Access Token

In your developer settings, create a new personal access token with access to your newly created repository with read/write permissions to code.

#### Add an IAM user to AWS

If using media uploads, you'll need to create a new IAM user to access the S3 bucket for media storage. All media for TinaCMS content is stored in the `core-data-tina-cms` bucket and access to sub-folders is given to users. Create a new user with the following inline policy:

```
{
 "Version":"2012-10-17",
 "Statement": [
   {
     "Sid": "AllowListingOfFolder",
     "Action": ["s3:ListBucket"],
     "Effect": "Allow",
     "Resource": ["arn:aws:s3:::core-data-tina-cms"],
     "Condition":{"StringLike":{"s3:prefix":["<folder-name>/*"]}}
   },
   {
     "Sid": "AllowAllS3ActionsInFolder",
     "Effect": "Allow",
     "Action": ["s3:*"],
     "Resource": ["arn:aws:s3:::core-data-tina-cms/<folder-name>/*"]
   }
 ]
}
```

Replace `<folder-name>` with the name of the folder in the S3 bucket where the media should be stored. As a naming convention, the name of the folder should be the same as the name of the GitHub repository created above.

After the user is created, use the "Security Credentials" tab to create an access key/secret for the user.

#### Deploy to Netlify

Create a new site on Netlify deployed from the `core-data-places` repository. Set all of the environment variables in .env.example as appropriate. Currently, Core Data Places can only be hosted on Netlify in "server" mode, as the TinaCMS functions are dependent on Netlify functions.

#### Single Sign On

See [Keycloak](docs/sso/keycloak-setup.md) documentation for single sign on.

#### Static Build

Core Data Places can be built in "static" mode, which will remove the dependency on an existing Core Data project. See [static deploy](docs/static-deploy.md) documentation.

## Upgrading

For more information on upgrading your existing Core Data Places site to a newer version, see the [update notes](docs/upgrade-notes.md) section.