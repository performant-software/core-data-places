import { Collection } from '@tinacms/schema-tools';

const Branding: Collection = {
  name: 'branding',
  label: 'Branding',
  path: 'content/branding',
  format: 'json',
  fields: [{
    name: 'primary_color',
    label: 'Primary Color',
    type: 'string',
    ui: {
      component: 'color'
    }
  }, {
    name: 'header',
    label: 'Header',
    type: 'object',
    fields: [{
      name: 'logo',
      label: 'Logo',
      type: 'image'
    }, {
      name: 'hide_title',
      label: 'Hide Title',
      type: 'boolean'
    }]
  }],
  ui: {
    allowedActions: {
      create: false,
      delete: false
    }
  }
};

export default Branding;
