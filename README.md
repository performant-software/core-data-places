# core-data-places

## Local Development

#### Requirements
- Node 20.x
- Netlify CLI

To start, run:
```
npm install && netlify dev
```

## Getting Started

#### Create a content repository
On GitHub, create a new content repository. The posts and paths records you create will be stored here, as well as any i18n, your project configuration, and default user accounts.

###### Configuration
Copy the `/public/config.json` file into your content repository to `/content/settings/config.json` and adjust the configuration as desired.

###### Users
Copy the `/data/users.json` file into your content repository to `/content/users/index.json`. This will seed TinaCMS with the initial set of user accounts, which can be used to setup accounts for other users, then removed.

**Note:** Do not commit any project specific changes to `/public/config.json` in this repository.

**Note:** Changes to `config.json` will require a re-build of the site.

| Key                         | Type    | Description                                                                                                                                                    |
|-----------------------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| content                     | Array   | Array of content keys to allow for data entry and routing: "posts", "paths"                                                                                    |
| i18n                        | Object  | Astro i18n configuration                                                                                                                                       |
| i18n.default_locale         | String  | The default locale                                                                                                                                             |
| i18n.locales                | Array   | A list of all available locales                                                                                                                                |
| layers                      | Array   | A list of available map layers                                                                                                                                 |
| layers.name                 | String  | The name of the map layer to display in the UI                                                                                                                 |
| layers.layer_type           | String  | Map layer type: "raster" or "vector"                                                                                                                           |
| layers.url                  | String  | URL to the map server                                                                                                                                          |
| layers.overlay              | Boolean | If `true`, map layer will be rendered as overlay layer. If `false`, map layer will be rendered as base layer                                                   |
| search                      | Object  | Search UI configuration                                                                                                                                        |
| search.cluster_radius       | Number  | If provided, search results will be clustered for the given radius (in miles)                                                                                  |
| search.result_card          | Object  | Search result card configuration                                                                                                                               |
| search.result_card.title    | String  | Path to the value in the Typesense document that should be used as the card title. This value can contain nested objects (e.g. `<relationship-id>.0.name`).    |
| search.result_card.subtitle | String  | Path to the value in the Typesense document that should be used as the card subtitle. This value can contain nested objects (e.g. `<relationship-id>.0.name`). |
| search.timeline             | Boolean | If `true`, a timeline component will display in the search results based on the events within the project. Search results can be filtered by related events.   |
| search.max_zoom             | Number  | The maximum zoom level to allow when the map view transitions to a set of bounds (a single place, or mulitple places).                                         |
| search.zoom_to_place        | Boolean | If `true` or not specified, clicking on an individual place marker or search result will zoom the map to its location (using the max zoom).                    |
| typesense                   | Object  | Typesense index connection information                                                                                                                         |
| typesense.host              | String  | Typesense host URL                                                                                                                                             |
| typesense.port              | Number  | Typesense host port                                                                                                                                            |
| typesense.protocol          | String  | Typesense host protocol. Typically "https" or "http"                                                                                                           |
| typesense.api_key           | String  | Typesense search API key. **NOTE:** This should be a read-only key.                                                                                            |
| typesense.index_name        | String  | Name of the Typesense collection                                                                                                                               |
| typesense.query_by          | String  | Typesense attributes to query when a search is executed                                                                                                        |
| typesense.default_sort      | String  | Typesense attribute to sort by when no search is entered or as a tiebreaker. Search relevance score will always take priority over this attribute.             |
| core_data                   | Object  | Core Data configuration                                                                                                                                        |
| core_data.url               | String  | URL of the Core Data application                                                                                                                               |
| core_data.project_ids       | Array   | Numeric array of Core Data project IDs to be included                                                                                                          |

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