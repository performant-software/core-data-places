import { Collection } from '@tinacms/schema-tools';

const Fonts = [{
  label: 'Afacad',
  value: 'Afacad'
}, {
  label: 'DM Sans',
  value: 'DM Sans'
}, {
  label: 'DM Serif Display',
  value: 'DM Serif Display'
},  {
  label: 'Inter',
  value: 'Inter'
}, {
  label: 'Open Sans',
  value: 'Open Sans'
}];

const Branding: Collection = {
  name: 'branding',
  label: 'Branding',
  path: 'content/branding',
  format: 'json',
  fields: [{
    name: 'title',
    label: 'Title',
    type: 'string'
  }, {
    name: 'font_header',
    label: 'Header Font',
    type: 'string',
    options: Fonts
  }, {
    name: 'font_body',
    label: 'Body Font',
    type: 'string',
    options: Fonts
  }, {
    name: 'primary_color',
    label: 'Primary Color',
    type: 'string',
    ui: {
      component: 'color'
    }
  }, {
    name: 'secondary_color',
    label: 'Secondary Color',
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
  }, {
    name: 'footer',
    label: 'Footer',
    type: 'object',
    fields: [{
      name: 'allow_login',
      label: 'Allow Login',
      type: 'boolean'
    }, {
      name: 'logos',
      label: 'Logos',
      type: 'object',
      list: true,
      fields: [{
        name: 'image',
        label: 'Image',
        type: 'image'
      }, {
        name: 'image_alt',
        label: 'Image Alt',
        type: 'string'
      }, {
        name: 'url',
        label: 'URL',
        type: 'string'
      }]
    }, {
      name: 'terms_url',
      label: 'Terms and Conditions URL',
      type: 'string'
    }, {
      name: 'privacy_url',
      label: 'Privacy Policy URL',
      type: 'string'
    }, {
      name: 'accessibility_url',
      label: 'Accessibility URL',
      type: 'string'
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
