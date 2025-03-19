# core-data-places

## Local Development

#### Requirements
- Node 20.x
- Netlify CLI

To start, run:
```
npm install && netlify dev
```

#### Configuration
Add a `/public/config.dev.json` file, which will be ignored by Git, to copy local config settings when starting the application.
 
## Getting Started

#### Create a content repository
On GitHub, create a new content repository. The posts and paths records you create will be stored here, as well as any i18n, your project configuration, and default user accounts.

###### Configuration
Copy the `/public/config.json` file into your content repository to `/content/settings/config.json` and adjust the configuration as desired.

###### Users
Copy the `/data/users.json` file into your content repository to `/content/users/index.json`. This will seed TinaCMS with the initial set of user accounts, which can be used to setup accounts for other users, then removed. Skip this step if you are using an SSO provider or institutional IdP to manage users instead.

**Note:** Do not commit any project specific changes to `/public/config.json` in this repository.

**Note:** Changes to `config.json` will require a re-build of the site.

| Key                                           | Type    | Description                                                                                                                                                              |
|-----------------------------------------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| content                                       | Array   | Array of content keys to allow for data entry and routing: "posts", "paths"                                                                                              |
| i18n                                          | Object  | Astro i18n configuration                                                                                                                                                 |
| i18n.default_locale                           | String  | The default locale                                                                                                                                                       |
| i18n.locales                                  | Array   | A list of all available locales                                                                                                                                          |
| layers                                        | Array   | A list of available map layers                                                                                                                                           |
| layers.name                                   | String  | The name of the map layer to display in the UI                                                                                                                           |
| layers.layer_type                             | String  | Map layer type: "raster", "vector", "geojson" or "georeference"                                                                                                          |
| layers.url                                    | String  | URL to the map server                                                                                                                                                    |
| layers.overlay                                | Boolean | If `true`, map layer will be rendered as overlay layer. If `false`, map layer will be rendered as base layer                                                             |
| map                                           | Object  | Map configuration                                                                                                                                                        |
| map.cluster_radius                            | Number  | If provided, map points will be clustered for the given radius (in miles). This option is only valid if the `map.geometry` property contains Lat/Lng coordinates.        |
| map.geometry                                  | String  | Path to the attribute that contains the GeoJSON data to be displayed on the map                                                                                          |
| map.max_zoom                                  | Number  | The maximum zoom level to allow when the map view transitions to a set of bounds (a single place, or mulitple places).                                                   |
| map.zoom_to_place                             | Boolean | If `true` or not specified, clicking on an individual place marker or search result will zoom the map to its location (using the max zoom).                              |
| search                                        | Object  | Search UI configuration                                                                                                                                                  |
| search.facets                                 | Object  | Search facets configuration. The key will be the name of the Typesense facet field.                                                                                      |
| search.facets.type                            | String  | Search facet type: "list" or "select"                                                                                                                                    |
| search.facets.icon                            | String  | Icon to display in the facet header                                                                                                                                      |
| search.geosearch                              | Boolean | If `true`, the "filter by map bounds" facet will be available.                                                                                                           |
| search.result_card                            | Object  | Search result card configuration                                                                                                                                         |
| search.result_card.title                      | String  | Path to the value in the Typesense document that should be used as the card title. This value can contain nested objects (e.g. `<relationship-id>.0.name`).              |
| search.result_card.subtitle                   | String  | Path to the value in the Typesense document that should be used as the card subtitle. This value can contain nested objects (e.g. `<relationship-id>.0.name`).           |
| search.result_card.attributes                 | Array   | Attributes to display in the search list and table                                                                                                                       |
| search.result_card.attributes.name            | String  | Path to the value in the Typesense document that should be used to look up the column value. This value can contain nested objects (e.g. `<relationship-id>.0.name`).    |
| search.result_card.attributes.icon            | String  | Name of the icon that should displayed next to the value in the search list. If not provided, a bullet point will be used.                                               |
| search.result_filtering.events.exclude        | Array   | List of attributes, user defined fields and associations to be excluded from the Search Detail card. See [below](##### Search detail filtering)                          |
| search.result_filtering.instances.exclude     | Array   | List of attributes, user defined fields and associations to be excluded from the Search Detail card. See [below](##### Search detail filtering)                          |                     
| search.result_filtering.organizations.exclude | Array   | List of attributes, user defined fields and associations to be excluded from the Search Detail card. See [below](##### Search detail filtering)                          |                    
| search.result_filtering.people.exclude        | Array   | List of attributes, user defined fields and associations to be excluded from the Search Detail card. See [below](##### Search detail filtering)                          |                   
| search.result_filtering.places.exclude        | Array   | List of attributes, user defined fields and associations to be excluded from the Search Detail card. See [below](##### Search detail filtering)                          |                  
| search.result_filtering.works.exclude         | Array   | List of attributes, user defined fields and associations to be excluded from the Search Detail card. See [below](##### Search detail filtering)                          |                  
| search.route                                  | String  | The navigation route to use when clicking on a search result card (e.g. "/places", "/organizations", etc)                                                                |
| typesense                                     | Object  | Typesense index connection information                                                                                                                                   |
| typesense.host                                | String  | Typesense host URL                                                                                                                                                       |
| typesense.port                                | Number  | Typesense host port                                                                                                                                                      |
| typesense.protocol                            | String  | Typesense host protocol. Typically "https" or "http"                                                                                                                     |
| typesense.api_key                             | String  | Typesense search API key. **NOTE:** This should be a read-only key.                                                                                                      |
| typesense.index_name                          | String  | Name of the Typesense collection                                                                                                                                         |
| typesense.query_by                            | String  | Typesense attributes to query when a search is executed                                                                                                                  |
| typesense.default_sort                        | String  | Typesense attribute to sort by when no search is entered or as a tiebreaker. Search relevance score will always take priority over this attribute.                       |
| typesense.exclude_fields                      | String  | Fields to exclude from the Typesense search response                                                                                                                     |
| typesense.facets                              | Object  | Facet configuration                                                                                                                                                      |
| typesense.facets.exclude                      | Array   | Array of facet names to exclude                                                                                                                                          |
| typesense.facets.include                      | Array   | Array of facet names to include                                                                                                                                          |
| typesense.overrides                           | Object  | Overrides for the [typesense-instantsearch-adapter](https://github.com/typesense/typesense-instantsearch-adapter).                                                       |
| core_data                                     | Object  | Core Data configuration                                                                                                                                                  |
| core_data.url                                 | String  | URL of the Core Data application                                                                                                                                         |
| core_data.project_ids                         | Array   | Numeric array of Core Data project IDs to be included                                                                                                                    |
| branding                                      | Object  | Branding configuration                                                                                                                                                   |
| branding.primary                              | String  | Primary theme color for website, in hex format (must be full six-digit hex, e.g. `#ffffff`)                                                                              |
| branding.header_logo                          | String  | URL of logo image to appear in header                                                                                                                                    |
| branding.header_hide_title                    | Boolean | If true, suppresses the text title from the header                                                                                                                       |
| branding.footer_logo                          | String  | URL of logo image to appear in footer                                                                                                                                    |
| branding.footer_hide_logo                     | Boolean | If true, suppresses the text title from the footer and displays a larger version of the logo                                                                             |
| branding.footer_orgs                          | Array   | Logos and links for organizations/partners to appear in footer                                                                                                           |
| branding.footer_orgs.logo                     | String  | URL of logo of an included organization                                                                                                                                  |
| branding.footer_orgs.url                      | String  | URL to which the logo of this org should link                                                                                                                            |
| branding.footer_orgs.alt                      | String  | Alt text for the logo of this org (e.g. the org title)                                                                                                                   |
| branding.footer_login                         | Boolean | If true, displays links in the footer to log into Core Data and TinaCMS                                                                                                  |

#### Create a new Personal Access Token

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

Create a new site on Netlify deployed from the `core-data-places` repository. Set all of the environment variables in .env.example as appropriate.

## Content Migration

If you're migrating content from a website that is currently storing content in the same repository as the website code, you can follow these steps to move the content.

#### Move MDX

Move the `.mdx` files in the `content/about`, `content/paths`, `/content/posts` directories to the same directories in your new content repository. Move any localization files from `/content/ui` to `content/i18n` in your new repository.

#### Move media

If using Astro, media will typically be stored in `/src/assets`. These media files will need to be moved to the newly created S3 bucket and the paths in the `.mdx` files will need to be updated accordingly.

##### Search detail filtering

You can filter what is shown in the detail pane when clicking an item in the search view. This is accomplished by adding a result_filtering object to the search block in the config.json file in the content directory.

- To filter native fields add the name of the native field to the exclude array:

```
"exclude":["name"]
```

- To filter user-defined fields add the GUID of the field to the exclude array:

```
"exclude":["name", "2f400af6-ee3f-42e4-8321-7b92c5a7cd23"]
```

- To filter one-to-many relationships (*Currently the only defined one-to-many relationship is `place_layers` in the `Place` model.*) add the relationship name to the exclude array

```
"exclude":["name", "2f400af6-ee3f-42e4-8321-7b92c5a7cd23", "place_layers"]
```

- To filter related records add the related record type to the exclude array.

The following related records can be excluded:

- relatedEvents
- relatedInstances
- relatedItems
- relatedOrganizations
- relatedManifest
- relatedPlaces
- relatedTaxonomies
- relatedWorks

```
"exclude":["name", "2f400af6-ee3f-42e4-8321-7b92c5a7cd23", "place_layers", "relatedOrganizations"]
```
