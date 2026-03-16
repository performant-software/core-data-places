import { Collection, TinaField } from '@tinacms/schema-tools';
import TinaMapLayerDefaultSwitch from '../components/TinaMapLayerDefaultSwitch';
import TinaMapLayerOverlaySwitch from '../components/TinaMapLayerOverlaySwitch';
import TinaMapLayerURLField from '../components/TinaMapLayerURLField';
import { postMetadata } from './posts';
import _ from 'underscore';

const editioncrafterConfigFields: TinaField<false>[] = [{
  name: 'xml_id_field',
  label: 'XML ID field identifier',
  type: 'string'
}, {
  name: 'faircopy_base_url',
  label: 'FairCopy base URL',
  type: 'string'
}, {
  name: 'faircopy_project_id',
  label: 'FairCopy project ID',
  type: 'string'
}, {
  name: 'transcription_types',
  label: 'Transcription Types',
  type: 'object',
  list: true,
  fields: [{
    name: 'key',
    label: 'XML ID of text resource',
    type: 'string'
  }, {
    name: 'label',
    label: 'Label',
    type: 'string'
  }]
}];

const sortOptions = _.map(postMetadata, (field) => ({
  label: field.label,
  value: field.name
}));

const attributeParserOptions = [{
  label: 'fuzzyDate',
  value: 'fuzzyDate'
}];

const Settings: Collection = {
  name: 'settings',
  label: 'Settings',
  path: 'content/settings',
  format: 'json',
  fields: [{
    name: 'content',
    label: 'Content',
    type: 'object',
    fields: [{
      name: 'collections',
      label: 'Collections',
      type: 'string',
      list: true
    }, {
      name: 'localize_pages',
      label: 'Localize Pages',
      type: 'boolean'
    }, {
      name: 'posts_config',
      label: 'Posts configuration',
      type: 'object',
      fields: [{
        name: 'categories',
        label: 'Categories',
        type: 'string',
        list: true
      }, {
        name: 'sort_by',
        label: 'Post display order',
        type: 'object',
        fields: [{
          name: 'name',
          label: 'Field to sort by',
          type: 'string',
          options: sortOptions
        }, {
          name: 'direction',
          label: 'Sort direction (ascending or descending)',
          type: 'string',
          options: [{
            label: 'Ascending',
            value: 'asc'
          }, {
            label: 'Descending',
            value: 'desc'
          }]
        }]
      }, {
        name: 'layout',
        label: 'Layout',
        type: 'string',
        options: [{
          label: 'List',
          value: 'list'
        }, {
          label: 'Grid',
          value: 'grid'
        }]
      }]
    }]
  }, {
    name: 'core_data',
    label: 'Core Data',
    type: 'object',
    fields: [{
      name: 'url',
      label: 'URL',
      type: 'string'
    }, {
      name: 'project_ids',
      label: 'Project IDs',
      type: 'string',
      list: true
    }]
  }, {
    name: 'detail_pages',
    label: 'Detail Pages',
    type: 'object',
    fields: [{
      name: 'models',
      label: 'Models',
      type: 'object',
      fields: [{
        name: 'events',
        label: 'Events',
        type: 'object',
        fields: [{
          name: 'related_manifest',
          label: 'Related Manifest',
          type: 'object',
          fields: [{
            name: 'model',
            label: 'Model',
            type: 'string'
          }, {
            name: 'relationship',
            label: 'Relationship',
            type: 'string'
          }]
        }, {
          name: 'resources_field',
          label: 'Resources Field',
          description: 'Should be of the form `<relationship uuid>.<field uuid>` and point to a field in an Items model whose values are full URLs.',
          type: 'string'
        }, {
          name: 'editioncrafter_config',
          label: 'EditionCrafter config',
          type: 'object',
          fields: editioncrafterConfigFields
        }]
      }, {
        name: 'instances',
        label: 'Instances',
        type: 'object',
        fields: [{
          name: 'related_manifest',
          label: 'Related Manifest',
          type: 'object',
          fields: [{
            name: 'model',
            label: 'Model',
            type: 'string'
          }, {
            name: 'relationship',
            label: 'Relationship',
            type: 'string'
          }]
        }, {
          name: 'editioncrafter_config',
          label: 'EditionCrafter config',
          type: 'object',
          fields: editioncrafterConfigFields
        }]
      }, {
        name: 'items',
        label: 'Items',
        type: 'object',
        fields: [{
          name: 'related_manifest',
          label: 'Related Manifest',
          type: 'object',
          fields: [{
            name: 'model',
            label: 'Model',
            type: 'string'
          }, {
            name: 'relationship',
            label: 'Relationship',
            type: 'string'
          }]
        }, {
          name: 'editioncrafter_config',
          label: 'EditionCrafter config',
          type: 'object',
          fields: editioncrafterConfigFields
        }]
      }, {
        name: 'organizations',
        label: 'Organizations',
        type: 'object',
        fields: [{
          name: 'related_manifest',
          label: 'Related Manifest',
          type: 'object',
          fields: [{
            name: 'model',
            label: 'Model',
            type: 'string'
          }, {
            name: 'relationship',
            label: 'Relationship',
            type: 'string'
          }]
        }, {
          name: 'editioncrafter_config',
          label: 'EditionCrafter config',
          type: 'object',
          fields: editioncrafterConfigFields
        }]
      }, {
        name: 'people',
        label: 'People',
        type: 'object',
        fields: [{
          name: 'related_manifest',
          label: 'Related Manifest',
          type: 'object',
          fields: [{
            name: 'model',
            label: 'Model',
            type: 'string'
          }, {
            name: 'relationship',
            label: 'Relationship',
            type: 'string'
          }]
        }, {
          name: 'editioncrafter_config',
          label: 'EditionCrafter config',
          type: 'object',
          fields: editioncrafterConfigFields
        }]
      }, {
        name: 'places',
        label: 'Places',
        type: 'object',
        fields: [{
          name: 'related_manifest',
          label: 'Related Manifest',
          type: 'object',
          fields: [{
            name: 'model',
            label: 'Model',
            type: 'string'
          }, {
            name: 'relationship',
            label: 'Relationship',
            type: 'string'
          }]
        }, {
          name: 'editioncrafter_config',
          label: 'EditionCrafter config',
          type: 'object',
          fields: editioncrafterConfigFields
        }]
      }, {
        name: 'taxonomies',
        label: 'Taxonomies',
        type: 'object',
        fields: [{
          name: 'related_manifest',
          label: 'Related Manifest',
          type: 'object',
          fields: [{
            name: 'model',
            label: 'Model',
            type: 'string'
          }, {
            name: 'relationship',
            label: 'Relationship',
            type: 'string'
          }]
        }, {
          name: 'editioncrafter_config',
          label: 'EditionCrafter config',
          type: 'object',
          fields: editioncrafterConfigFields
        }]
      }, {
        name: 'works',
        label: 'Works',
        type: 'object',
        fields: [{
          name: 'related_manifest',
          label: 'Related Manifest',
          type: 'object',
          fields: [{
            name: 'model',
            label: 'Model',
            type: 'string'
          }, {
            name: 'relationship',
            label: 'Relationship',
            type: 'string'
          }]
        }, {
          name: 'editioncrafter_config',
          label: 'EditionCrafter config',
          type: 'object',
          fields: editioncrafterConfigFields
        }]
      }]
    }, {
      name: 'relationship_fields',
      label: 'Relationship Fields',
      type: 'object',
      fields: [{
        name: 'events',
        label: 'Events',
        type: 'string',
        list: true
      }, {
        name: 'instances',
        label: 'Instances',
        type: 'string',
        list: true
      }, {
        name: 'items',
        label: 'Items',
        type: 'string',
        list: true
      }, {
        name: 'works',
        label: 'Works',
        type: 'string',
        list: true
      }]
    }]
  },
  {
    name: 'i18n',
    label: 'Internationalization',
    type: 'object',
    fields: [{
      name: 'default_locale',
      label: 'Default locale',
      type: 'string'
    }, {
      name: 'locales',
      label: 'Locales',
      type: 'string',
      list: true
    }]
  }, {
    name: 'gallery',
    label: 'Gallery',
    type: 'string'
  }, {
    name: 'layers',
    label: 'Layers',
    type: 'object',
    list: true,
    ui: {
      itemProps: (layer) => ({ label: layer.name })
    },
    fields: [{
      name: 'name',
      label: 'Name',
      type: 'string'
    }, {
      name: 'layer_type',
      label: 'Layer type',
      type: 'string',
      options: [{
        label: 'Vector',
        value: 'vector'
      }, {
        label: 'Raster',
        value: 'raster'
      }, {
        label: 'GeoJSON',
        value: 'geojson'
      }, {
        label: 'Georeference',
        value: 'georeference'
      }]
    }, {
      name: 'url',
      label: 'URL',
      type: 'string',
      ui: {
        component: TinaMapLayerURLField,
      },
    }, {
      name: 'overlay',
      label: 'Overlay',
      type: 'boolean',
      ui: {
        component: TinaMapLayerOverlaySwitch,
      },
    }, {
      name: 'default',
      label: 'Visible by default',
      type: 'boolean',
      ui: {
        component: TinaMapLayerDefaultSwitch,
      },
    }]
  }, {
    name: 'result_filtering',
    label: 'Result Filtering',
    type: 'object',
    fields: [{
      name: 'events',
      label: 'Events',
      type: 'object',
      fields: [{
        name: 'exclude',
        label: 'Exclude',
        type: 'string',
        list: true,
      }]
    }, {
      name: 'instances',
      label: 'Instances',
      type: 'object',
      fields: [{
        name: 'exclude',
        label: 'Exclude',
        type: 'string',
        list: true,
      }]
    }, {
      name: 'items',
      label: 'Items',
      type: 'object',
      fields: [{
        name: 'exclude',
        label: 'Exclude',
        type: 'string',
        list: true,
      }]
    }, {
      name: 'organizations',
      label: 'Organizations',
      type: 'object',
      fields: [{
        name: 'exclude',
        label: 'Exclude',
        type: 'string',
        list: true,
      }]
    }, {
      name: 'people',
      label: 'People',
      type: 'object',
      fields: [{
        name: 'exclude',
        label: 'Exclude',
        type: 'string',
        list: true,
      }]
    }, {
      name: 'places',
      label: 'Places',
      type: 'object',
      fields: [{
        name: 'exclude',
        label: 'Exclude',
        type: 'string',
        list: true,
      }]
    }, {
      name: 'works',
      label: 'Works',
      type: 'object',
      fields: [{
        name: 'exclude',
        label: 'Exclude',
        type: 'string',
        list: true,
      }]
    }]
  }, {
    name: 'search',
    label: 'Search',
    type: 'object',
    list: true,
    ui: {
      itemProps: (search) => {
        return { label: search?.name }
      }
    },
    fields: [{
      name: 'name',
      label: 'Name',
      type: 'string',
      required: true
    }, {
      name: 'route',
      label: 'Route',
      type: 'string',
      required: true
    }, {
      name: 'type',
      label: 'Type',
      type: 'string',
      options: [{
        label: 'Map',
        value: 'map'
      }, {
        label: 'List',
        value: 'list'
      }, {
        label: 'Grid',
        value: 'grid'
      }, {
        label: 'Image',
        value: 'image'
      }]
    }, {
      name: 'geosearch',
      label: 'Geo-search',
      type: 'boolean'
    }, {
      name: 'facets',
      label: 'Facets',
      type: 'object',
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.name }
        }
      },
      fields: [{
        name: 'name',
        label: 'Name',
        type: 'string',
        required: true
      }, {
        name: 'icon',
        label: 'Icon',
        type: 'string'
      }, {
        name: 'type',
        label: 'Type',
        type: 'string',
        options: [{
          value: 'list',
          label: 'List',
        }, {
          value: 'select',
          label: 'Select',
        }]
      }]
    }, {
      name: 'map',
      label: 'Map',
      type: 'object',
      fields: [{
        name: 'cluster_radius',
        label: 'Cluster Radius',
        type: 'number'
      }, {
        name: 'geometry',
        label: 'Geometry',
        type: 'string'
      }, {
        name: 'max_zoom',
        label: 'Max zoom',
        type: 'number'
      }, {
        name: 'zoom_to_place',
        label: 'Zoom to place',
        type: 'boolean'
      }]
    }, {
      name: 'result_card',
      label: 'Result card',
      type: 'object',
      fields: [{
        name: 'title',
        label: 'Title',
        type: 'string',
        required: true
      }, {
        name: 'attributes',
        label: 'Attributes',
        type: 'object',
        list: true,
        ui: {
          itemProps: (item) => {
            return { label: item?.name }
          }
        },
        fields: [{
          name: 'name',
          label: 'Name',
          type: 'string',
          required: true
        }, {
          name: 'icon',
          label: 'Icon',
          type: 'string'
        }, {
          name: 'parser',
          label: 'Parser to use for formatting',
          type: 'string',
          options: attributeParserOptions
        }]
      }, {
        name: 'relationships',
        label: 'Relationships',
        type: 'string',
        list: true
      }, {
        name: 'tags',
        label: 'Tags',
        type: 'object',
        list: true,
        fields: [{
          name: 'name',
          label: 'Name',
          type: 'string'
        }, {
          name: 'primary',
          label: 'Primary',
          type: 'boolean'
        }, {
          name: 'secondary',
          label: 'Secondary',
          type: 'boolean'
        }, {
          name: 'parser',
          label: 'Parser to use for formatting',
          type: 'string',
          options: attributeParserOptions
        }]
      }]
    }, {
      name: 'table',
      label: 'Table results view?',
      type: 'boolean'
    }, {
      name: 'timeline',
      label: 'Timeline',
      type: 'object',
      fields: [{
        name: 'date_range_facet',
        label: 'Date range facet',
        type: 'string'
      }, {
        name: 'event_path',
        label: 'Event path',
        type: 'string'
      }]
    }, {
      name: 'typesense',
      label: 'Typesense',
      type: 'object',
      fields: [{
        name: 'host',
        label: 'Host',
        type: 'string'
      }, {
        name: 'port',
        label: 'Port',
        type: 'number'
      }, {
        name: 'protocol',
        label: 'Protocol',
        type: 'string'
      }, {
        name: 'api_key',
        label: 'API key',
        type: 'string'
      }, {
        name: 'index_name',
        label: 'Index name',
        type: 'string'
      }, {
        name: 'query_by',
        label: 'Query by',
        type: 'string'
      }, {
        name: 'default_sort',
        label: 'Default sort',
        type: 'string'
      }, {
        name: 'exclude_fields',
        label: 'Exclude fields',
        type: 'string',
        list: true
      }, {
        name: 'facets',
        label: 'Facets',
        type: 'object',
        fields: [{
          name: 'exclude',
          label: 'Exclude',
          type: 'string',
          list: true
        }, {
          name: 'include',
          label: 'Include',
          type: 'string',
          list: true
        }]
      }, {
        name: 'overrides',
        label: 'Overrides',
        type: 'object',
        fields: [{
          name: 'geoLocationField',
          label: 'Geo-location field',
          type: 'string'
        }, {
          name: 'additionalSearchParameters',
          label: 'Additional Search Parameters',
          type: 'object',
          fields: [{
            name: 'filter_by',
            label: 'Filter By',
            type: 'string'
          }, {
            name: 'preset',
            label: 'Preset',
            type: 'boolean',
          }]
        }]
      }]
    }]
  }],
  ui: {
    allowedActions: {
      create: false,
      delete: false
    }
  }
};

export default Settings;