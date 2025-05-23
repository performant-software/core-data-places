# Configuration Schema
A detailed description of the Core Data Places configuration schema.

## content

```
collections: Array<"paths" | "posts">
```
Determines which content collections are available in TinaCMS and display in the navigation menu.

- Required: `false`

```
localize_pages: Boolean
```
If set to `true`, pages will be nested within a localized directory (e.g `/pages/en/Home.mdx`). If `false`, pages will not be localized and placed in the root `/pages` directory.

- Required: `false`
- Default value: `false`

---

## core_data

``` 
url: String
```
URL of the Core Data application (e.g `https://staging.coredata.cloud`).

- Required: `true`

```
project_ids: Array<String>
```
An array of Core Data project IDs. The project ID can be found in the address bar when accessing the Core Data platform (e.g. `https://staging.coredata.cloud/projects/:project_id`).

- Required: `true`

---

## detail_pages
An array of model names for which full page records should be available. Pages will be routed at `/:name/:uuid` (e.g. `/places/196c3113-5fdd-4453-81a1-3ce0ac22d1f4`). 

```
Array<"events" | "instances" | "items" | "organizations" | "people" | "places" | "works">
```

- Required: `false`

---

## i18n

```
default_locale: String
```
The site will be redirected to this locale automatically when the root path is visited.

- Required: `true`

```
locales: Array<String>
```
An array of all supported locales.

- Required: `true`

---

## layers

```
Array<Layer>
```
The map layers configuration array. For each entry, the map menu will provide a list of base layers and overlays that can be toggled.

- Required: `true`
- [Reference](#layer)

---

### Layer

```
name: string
```
Name of the map layer. This value will display in the map UI.

- Required: `true`

```
type: "geojson" | "georeference" | "raster" | "vector"
```
The type of map layer to be rendered. This value will be used in conjunction with the below `url` value to determine how to render the layer.

- Required: `true`

```
url: String
```
URL to the map server which will serve the map layer.

- Required: `true`

``` 
overlay: Boolean
```
If `true`, the layer can be rendered on top of the base map layer.

- Required: `false`
- Default value: `false`

--- 

## result_filtering

See [Search Detail Filters](search-detail-filtering.md).

---

## search

```
Array<Search>
```
The array of search configuration objects. For each entry, an option will display under the "Explore" navigation menu.

- Required: `true`

---

### Search

```
facets: Array<Facet>
```
Facet rendering customizations.

- Required: `false`
- [Reference](#facet)

```
geosearch: Boolean
```
If `true`, the "Filter by map bounds" option will be available on the map facet menu. This option will allow the user to filter the search results by zooming/panning the map viewport. This option should only be used if the data set contains only Latitude/Longitude geometries.

- Required: `false`
- Default value: `false`

```
map: Map
```
Map configuration options

- Required: `true`
- [Reference](#map)

```
name: string
```
Name of the search configuration. This value will be added to the i18n config with a "index_" prefix to allow setting a label for the navigation menu dropdown option. For example, a name of "places" would add the key "index_places" to the i18n JSON files.

- Required: `true`

``` 
result_card: ResultCard
```
Search result card/table configuration.

- Required: `true`
- [Reference](#resultcard)

```
route: "/events" | "/instances" | "/items" | "/organizations" | "/people" | "/places" | "/works"
```
The path prefix for which to navigate which clicking on a search result. For example, a value of "/places" will navigate to "/places/:uuid" when click on a search result.

- Required: `true`

```
table: Boolean
```
If `true` the table view will be available for selection in the search UI.

- Required: `false`
- Default value: `true`

```
timeline: Timeline
```
Search timeline configuration.

- Required: `false`
- [Reference](#timeline)

```
typesense: Typesense
```
Typesense parameters.

- Required: `true`
- [Reference](#typesense)

---

#### Facet

```
icon: String
```
Name of the icon to display in the facet title. See `react-components` [Icons](https://github.com/performant-software/react-components/blob/master/packages/core-data/src/components/Icon.js).

Required: `false`

```
name: String
```
Name of the facet field in the Typesense schema. These fields will always end with a "_facet" suffix (e.g. "name_facet).

Required: `false`

```
type: "list" | "select"
```
Describes how to render the facet. A value of "list" will render checkboxes for each facet value. A value of "select" will render searchable dropdown. Both options allow multiple selections.

- Required: `false`
- Default value: "list"

---

#### Map

```
cluster_radius: Number
```
If provided, map points will be clustered for the given radius (in miles). This option is only valid if the `map.geometry` property contains Lat/Lng coordinates.

- Required: `false`

```
geometry: String
```
Path from the root Typesense document to the geometry object that will be displayed on the map.

**Examples:**

1. `geometry` - The geometry is contained within the `geometry` property of the root element

2. `b290e255-d89c-4c0a-8d9b-0790445c3d8f.geometry` - The geometry is contained within the array of related records defined by the UUID within the `geometry` property.

- Required: `true`

```
max_zoom: Number
```
Corresponds to the Maplibre [MapOptions](https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/MapOptions/#maxzoom) maxZoom. The maximum zoom level allowed by the map.

- Required: `false`
- Default value: `14`

```
zoom_to_place: Boolean
```
If `true`, the map animation will zoom/pan the map bounding box to fit the search results and when a result is selected.

- Required: `false`
- Default value: `true`

---

#### ResultCard

```
title: String
```
The property on the Typesense document to use as the search result card title. This property will also be used as the first column in the table view. This property will also accept a path to drill down into nested objects (e.g. `9a006156-3564-4cb1-bedb-6600c0419226.0.name`).

- Required: `true`

```
attributes: Array<Attribute>
```
Additional attributes to display on the search result card and table view.

- Required: `false`
- [Reference](#attribute)

---

##### Attribute

```
name: String
```
The property on the Typesense document to display. This property will also accept a path to drill down into nested objects (e.g. `9a006156-3564-4cb1-bedb-6600c0419226.0.name`).

- Required: `true`

```
icon: String
```
Name of the icon to display next to the attribute. See `react-components` [Icons](https://github.com/performant-software/react-components/blob/master/packages/core-data/src/components/Icon.js). If no icon value is provided, the search card will display a bullet.


- Required: `false`

---

#### Timeline

```
date_range_facet: String
```
The property on the Typesense document to use as facet value for the timeline.

- Required: `true`

```
event_path: String
```
Path from the root Typesense document to the events nested objects that will be displayed on the timeline.

- Required: `false`

---

#### Typesense

```
host: String
```
Typesense server URL.

- Required: `true`

```
port: Number
```
Typesense server port, typically `443` or `8108`.

- Required: `true`

```
protocol: String
```
Typically `http` or `https`.

- Required: `true`

```
api_key: String
```
Typesense API key.

- Required: `true`

```
index_name: String
```
Typesense index name.

- Required: `true`

```
query_by: String
```
Typesense document field(s) to search when a query is executed.

- Required: `true`

```
default_sort: String
```
A list of fields and their corresponding sort orders that will be used for ordering your results. Separate multiple fields with a comma.

- Required: `false`

```
exclude_fields: String
```
Comma-separated list of fields from the document to exclude in the search result.

- Required: `false`

```
facets: Array<Facet>
```
Configuration for the facets to include/exclude from the list.

- Required: `false`
- [Reference](#facet-1)

```
overrides: Object
```
Configuration options to pass to the [Typesense InstantSearch Adapter](https://github.com/typesense/typesense-instantsearch-adapter).

- Required: `false`

---

##### Facet

```
exclude: Array<String>
```
Comma-separated list of fields to exclude from the list of available facets.

- Required: `false`

```
include: Array<String>
```
Comma-separated list of fields to include in the list of available facets.

- Required: `false`