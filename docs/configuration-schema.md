# Configuration Schema

A detailed description of the Core Data Places configuration schema.

## content

TinaCMS content collections.

Required: No

### collections

Determines which content collections are available in TinaCMS and display in the navigation menu.

```
Array<"paths" | "posts">
```

Required: No

### localize_pages

If set to `true`, pages will be nested within a localized directory (e.g `/pages/en/Home.mdx`). If `false`, pages will not be localized and placed in the root `/pages` directory.

```
Boolean
```

Required: No

---

## core_data

Core Data configuration options.

Required: Yes

### url

URL of the Core Data application (e.g `https://staging.coredata.cloud`).

```
String
```

Required: Yes

### project_ids

An array of Core Data project IDs. The project ID can be found in the address bar when accessing the Core Data platform (e.g. `https://staging.coredata.cloud/projects/:project_id`).

```
Array<String>
```

Required: Yes

---

## detail_pages

An array of model names for which full page records should be available. Pages will be routed at `/:name/:uuid` (e.g. `/places/196c3113-5fdd-4453-81a1-3ce0ac22d1f4`). 

```
Array<"events" | "instances" | "items" | "organizations" | "people" | "places" | "works">
```

Required: No

---

## i18n

AstroJS i18n configuration options.

Required: Yes

### default_locale

The site will be redirected to this locale automatically when the root path is visited.

```
String
```

Required: Yes

### locales

An array of all supported locales.

```
Array<String>
```

Required: Yes

---

## layers

The map layers configuration array. For each entry, the map menu will provide a list of base layers and overlays that can be toggled.

Required: Yes

### name

Name of the map layer. This value will display in the map UI.

```
string
```

Required: Yes

### type

The type of map layer to be rendered. This value will be used in conjunction with the below `url` value to determine how to render the layer.

```
"geojson" | "georeference" | "raster" | "vector"
```

Required: Yes

### url

URL to the map server which will serve the map layer.

```
String
```

Required: `true`

### overlay

If `true`, the layer can be rendered on top of the base map layer.

``` 
Boolean
```

Required: No  
Default value: `false`

--- 

## result_filtering

See [Search Detail Filters](search-detail-filtering.md).

---

## search

The array of search configuration objects. For each entry, an option will display under the "Explore" navigation menu.

Required: Yes

### facets

Array of facet rendering customizations.

Required: No

##### icon

Name of the icon to display in the facet title. See `react-components` [Icons](https://github.com/performant-software/react-components/blob/master/packages/core-data/src/components/Icon.js).

```
String
```

Required: No

##### name

Name of the facet field in the Typesense schema. These fields will always end with a "_facet" suffix (e.g. "name_facet).

```
String
```

Required: No

##### type

Describes how to render the facet. A value of "list" will render checkboxes for each facet value. A value of "select" will render searchable dropdown. Both options allow multiple selections.

```
"list" | "select"
```

Required: No  
Default value: `list`

### geosearch

If `true`, the "Filter by map bounds" option will be available on the map facet menu. This option will allow the user to filter the search results by zooming/panning the map viewport. This option should only be used if the data set contains only Latitude/Longitude geometries.

```
Boolean
```

Required: No  
Default value: `false`

### map

Map configuration options.

Required: Yes

#### cluster_radius

If provided, map points will be clustered for the given radius (in miles). This option is only valid if the `map.geometry` property contains Lat/Lng coordinates.

```
Number
```

Required: No

#### geometry

Path from the root Typesense document to the geometry object that will be displayed on the map.

```
String
```

Required: Yes

Examples:

1. `geometry` - The geometry is contained within the `geometry` property of the root element

2. `b290e255-d89c-4c0a-8d9b-0790445c3d8f.geometry` - The geometry is contained within the array of related records defined by the UUID within the `geometry` property.


#### max_zoom

Corresponds to the Maplibre [MapOptions](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/#maxzoom) maxZoom. The maximum zoom level allowed by the map.

```
Number
```

Required: No  
Default value: `14`

#### zoom_to_place

If `true`, the map animation will zoom/pan the map bounding box to fit the search results and when a result is selected.

```
Boolean
```

Required: No  
Default value: `true`

### name

Name of the search configuration. This value will be added to the i18n config with a "index_" prefix to allow setting a label for the navigation menu dropdown option. For example, a name of "places" would add the key "index_places" to the i18n JSON files.

```
String
```

Required: Yes

### result_card

Search result card/table configuration.

Required: false

#### title

The property on the Typesense document to use as the search result card title. This property will also be used as the first column in the table view. This property will also accept a path to drill down into nested objects (e.g. `9a006156-3564-4cb1-bedb-6600c0419226.0.name`).

```
String
```

Required: Yes

#### attributes

Array of additional attributes to display on the search result card and table view.

Required: No

##### name

The property on the Typesense document to display. This property will also accept a path to drill down into nested objects (e.g. `9a006156-3564-4cb1-bedb-6600c0419226.0.name`).

```
String
```

Required: Yes

##### icon

Name of the icon to display next to the attribute. See `react-components` [Icons](https://github.com/performant-software/react-components/blob/master/packages/core-data/src/components/Icon.js). If no icon value is provided, the search card will display a bullet.

```
String
```

Required: No

### route

The path prefix for which to navigate which clicking on a search result. For example, a value of "/places" will navigate to "/places/:uuid" when click on a search result.

```
"/events" | "/instances" | "/items" | "/organizations" | "/people" | "/places" | "/works"
```

Required: Yes

### table

If `true` the table view will be available for selection in the search UI.

```
Boolean
```

Required: No
Default value: `true`

### timeline

Search timeline configuration.

#### date_range_facet

The property on the Typesense document to use as facet value for the timeline.

```
String
```

Required: Yes

#### event_path

Path from the root Typesense document to the events nested objects that will be displayed on the timeline.

```
String
```

Required: No

### typesense

Typesense configuration options.

Required: Yes

#### host

Typesense server URL.

```
String
```

Required: Yes

#### port

Typesense server port, typically `443` or `8108`.

```
Number
```

Required: Yes

#### protocol

Typically `http` or `https`.

```
String
```

Required: Yes

#### api_key

Typesense API key.

```
String
```

Required: Yes

#### index_name

Typesense index name.

```
String
```

Required: Yes

#### query_by

Typesense document field(s) to search when a query is executed.

```
String
```

Required: Yes

#### default_sort

A list of fields and their corresponding sort orders that will be used for ordering your results. Separate multiple fields with a comma.

```
String
```

Required: No

#### exclude_fields

Comma-separated list of fields from the document to exclude in the search result.

```
String
```

Required: No

#### facets

Configuration for the facets to include/exclude from the list.

##### exclude

Comma-separated list of fields to exclude from the list of available facets.

```
Array<String>
```

Required: No

##### include

Comma-separated list of fields to include in the list of available facets.

```
Array<String>
```

Required: No

#### overrides

Configuration options to pass to the [Typesense InstantSearch Adapter](https://github.com/typesense/typesense-instantsearch-adapter).

```
Object
```

Required: No