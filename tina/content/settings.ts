import TinaMapLayerURLField from '../components/TinaMapLayerURLField';
import TinaMapLayerOverlaySwitch from '../components/TinaMapLayerOverlaySwitch';
import { Collection } from '@tinacms/schema-tools';

const Settings: Collection = {
  name: 'settings',
  label: 'Settings',
  path: 'content/settings',
  format: 'json',
  fields: [{
    name: 'content',
    label: 'Content',
    type: 'string',
    list: true
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
    name: 'search',
    label: 'Search',
    type: 'object',
    fields: [{
      name: 'geosearch',
      label: 'Geosearch',
      type: 'boolean'
    }, {
      name: 'result_card',
      label: 'Result card',
      type: 'object',
      fields: [{
        name: 'title',
        label: 'Title',
        type: 'string'
      }, {
        name: 'subtitle',
        label: 'Subtitle',
        type: 'string'
      }]
    }, {
      name: 'route',
      label: 'Route',
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
  }],
  ui: {
    allowedActions: {
      create: false,
      delete: false
    }
  }
};

export default Settings;