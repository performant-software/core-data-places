# Search detail filtering

You can filter what is shown in the detail pane when clicking an item in the search view. This is accomplished by adding a result_filtering object in the config.json file in the content directory.

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