# Upgrade Notes

Describes the breaking changes and steps required to upgrade to a more recent version of Core Data Places.

## v1.2.0

### Content Collections

`v1.2.0` will add two new content collections: “branding” and “pages”

- Add a new directory for `/content/branding` and create a branding.json file
- Add a new directory for `/content/pages`
  - Create a `Home.mdx` file and mimic the “About” page configuration
    - See [PSS Scavenger Hunt](https://github.com/performant-software/pss-scavenger-hunt-content/blob/main/content/settings/config.json) for an example
- Remove the `/content/about` directory

### Config.json

`v1.2.0` will also make some changes to the `config.json` file

- Remove the `branding` option; This will now be handled within the content collection
- Re-structure the `content` option
  - See [PSS Scavenger Hunt](https://github.com/performant-software/pss-scavenger-hunt-content/blob/main/content/settings/config.json) for an example
  - The `content` option will now allow a `localize_pages` true/false property (default: false)
    - If set the “true”, content pages should be nested in a localized directory (e.g. `/content/en/Home.mdx`)

---

## v1.1.0

### Timeline

`v1.1.0` adds the timeline feature to the map search. To enable this feature it must be configured in `config.search` by specifying a `timeline.date_range_facet` value giving the path to the Typesense field containing the date range facet field that the timeline will be based on. If event is not the primary model for the search, you must also specify the `timeline.event_path`, the path to the `event` relation in Typesense. For example:

```
"search": {
  "timeline": {
    "date_range_facet": "event_range_facet",
    "event_path": "<uuid of event relationship to primary model>"
  }
  ...
}
```

---

## v1.0.0

Version `v1.0.0` of Core Data Places is released :rocket:!

Here are some notes to assist with updating websites on Netlify:

- Add `MONGODB_COLLECTION_NAME` environment variable in Netlify
  - This will allow the production version of the site to use a different MongoDB collection than the deploy previews
- Add `branding` property to `config.json`
  - Default values should be:

```
"branding": {
  "header_hide_title": false,
  "footer_hide_title": false,
  "footer_login": true
}
```

- Move `max_zoom` and `zoom_to_place` properties from `search` to `map` in `config.json`
- Remove `cluster_radius` property in config.json
  - There is currently a bug with using clustering
- Add `geometry` property to `map` in `config.json`
  - This value should contain the path from the root Typesense document to the property that contains the GeoJSON data to plot on the map
  - e.g. `2ee9481e-3469-4c12-8b2e-78c8a814d175.geometry`
- Add `route` property to `search` in `config.json`
  - This value should correspond to the root Typesense document type
  - e.g. `/places` or `/organizations`
- If using Keycloak SSO (currently only GBoF projects), add the following environment variables on Netlify (the `AUTH_SECRET` is just any random token):

```
AUTH_KEYCLOAK_ID=tinacms
AUTH_KEYCLOAK_ISSUER=https://keycloak.archivengine.com/realms/GBoF
AUTH_KEYCLOAK_SECRET=wmWNCBZghjlvsQsQZLLedWpMV4DF6Ztr
AUTH_SECRET=<your special secret code here>
AUTH_TRUST_HOST=true
PUBLIC_BASE_URL=<url of site>
TINA_PUBLIC_AUTH_USE_KEYCLOAK=true
```

- Make sure all desired users are added to the GBoF realm in Keycloak
- Create new Typesense collection if necessary and update config:
  - The model that's indexed should be the model type specified in `search.route`
  - Update the config file with the correct `typesense` config, e.g.:

```
"typesense": {
  "host": "mk0zu5rvf46oa2h7p-1.a1.typesense.net",
  "port": 443,
  "protocol": "https",
  "api_key": <search key for this collection>,
  "index_name": <your index name>,
  "query_by": "name",
  "facets": {
    "exclude": [
      "all_projects.name_facet",
      "owner_project.name_facet",
      "names_facet"
    ]
  }
}
```

- Checklist for project customization options in config:
  - `typesense.facets.exclude` - list of facets to suppress from the faceted search interface
    - Alternatively, can use `typesense.facets.include` to provide a complete list of facets to include
  - `search.results_card` - customize which field shows up as the main title and any other fields you want to show up in the result list, e.g.

```
"result_card": {
  "attributes": [{
    "name": "40de3d57-c3d0-4152-ab61-f970c0ada2a0.0.name",
    "icon": "location"
  }],
  "title": "name"
}
```

- `search.result_filtering` - an object specifying fields to exclude on the detail panel for different model types, e.g.

```
"result_filtering": {
  "organizations": {
    "exclude": ["da725d0a-df8d-44c6-92ee-c16c2acb342a"]
  }
}
```

- `search.timeline` - boolean value that specifies whether to include the timeline feature (this should be `false` for now until the feature is supported in a future version!)