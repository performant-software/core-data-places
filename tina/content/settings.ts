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
    type: 'string',
    list: true
  }, {
    name: 'i18n',
    label: 'Internationalization',
    type: 'object',
    fields: [{
      name: 'default_locale',
      label: 'Default Locale',
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
      label: 'Layer Type',
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
    name: 'search',
    label: 'Search',
    type: 'object',
    fields: [{
      name: 'cluster_radius',
      label: 'Cluster Radius',
      type: 'number'
    }, {
      name: 'result_card',
      label: 'Result Card',
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
      name: 'timeline',
      label: 'Timeline',
      type: 'boolean'
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
      label: 'API Key',
      type: 'string'
    }, {
      name: 'index_name',
      label: 'Index Name',
      type: 'string'
    }, {
      name: 'query_by',
      label: 'Query By',
      type: 'string'
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