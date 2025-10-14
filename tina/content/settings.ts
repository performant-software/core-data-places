import { Collection } from '@tinacms/schema-tools';
import TinaMapLayerDefaultSwitch from '../components/TinaMapLayerDefaultSwitch';
import TinaMapLayerOverlaySwitch from '../components/TinaMapLayerOverlaySwitch';
import TinaMapLayerURLField from '../components/TinaMapLayerURLField';

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
    name: 'web_authorities',
    label: 'Web Authorities',
    type: 'object',
    fields: [{
      name: 'events',
      label: 'Events',
      type: 'object',
      fields: [{
        name: 'authorities',
        label: 'Authorities',
        type: 'object',
        list: true,
        fields: [{
          name: 'source_type',
          label: 'source_type',
          type: 'string',
        }, {
          name: 'base_url',
          label: 'base_url',
          type: 'string'
        }]
      }]
    }, {
      name: 'instances',
      label: 'Instances',
      type: 'object',
      fields: [{
        name: 'authorities',
        label: 'Authorities',
        type: 'object',
        list: true,
        fields: [{
          name: 'source_type',
          label: 'source_type',
          type: 'string',
        }, {
          name: 'base_url',
          label: 'base_url',
          type: 'string'
        }]
      }]
    }, {
      name: 'organizations',
      label: 'Organizations',
      type: 'object',
      fields: [{
        name: 'authorities',
        label: 'Authorities',
        type: 'object',
        list: true,
        fields: [{
          name: 'source_type',
          label: 'source_type',
          type: 'string',
        }, {
          name: 'base_url',
          label: 'base_url',
          type: 'string'
        }]
      }]
    }, {
      name: 'people',
      label: 'People',
      type: 'object',
      fields: [{
        name: 'authorities',
        label: 'Authorities',
        type: 'object',
        list: true,
        fields: [{
          name: 'source_type',
          label: 'source_type',
          type: 'string',
        }, {
          name: 'base_url',
          label: 'base_url',
          type: 'string'
        }]
      }]
    }, {
      name: 'places',
      label: 'Places',
      type: 'object',
      fields: [{
        name: 'authorities',
        label: 'Authorities',
        type: 'object',
        list: true,
        fields: [{
          name: 'source_type',
          label: 'source_type',
          type: 'string',
        }, {
          name: 'base_url',
          label: 'base_url',
          type: 'string'
        }]
      }]
    }, {
      name: 'works',
      label: 'Works',
      type: 'object',
      fields: [{
        name: 'authorities',
        label: 'Authorities',
        type: 'object',
        list: true,
        fields: [{
          name: 'source_type',
          label: 'source_type',
          type: 'string',
        }, {
          name: 'base_url',
          label: 'base_url',
          type: 'string'
        }]
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
        list: true,
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
        fields: [{
          name: 'name',
          label: 'Name',
          type: 'string',
          required: true
        }, {
          name: 'icon',
          label: 'Icon',
          type: 'string'
        }]
      }, {
    name: 'table',
    label: 'Table results view?',
    type: 'boolean'
  }]
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