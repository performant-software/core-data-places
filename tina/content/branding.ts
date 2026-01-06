import { Collection } from '@tinacms/schema-tools';

const Fonts = [{
  label: 'Afacad',
  value: 'Afacad'
}, {
  label: 'Baskervville',
  value: 'Baskervville'
}, {
  label: 'Crimson Text SemiBold',
  value: 'Crimson Text SemiBold'
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
  label: 'Libre Bodoni',
  value: 'Libre Bodoni'
}, {
  label: 'Open Sans',
  value: 'Open Sans'
}];

const HomeHeaderSizeOptions = [{
  label: 'Default (52px)',
  value: '52px'
}, {
  label: 'Large (64px)',
  value: '64px'
}, {
  label: 'Extra Large (74px)',
  value: '74px'
}];

const PageHeaderSizeOptions = [{
  label: 'Default(48px)',
  value: '48px'
}, {
  label: 'Large (64px)',
  value: '64px'
}];

const HeaderFontWeightOptions = [{
  label: 'Default (normal)',
  value: '400'
}, {
  label: 'Semi-bold',
  value: '600'
}, {
  label: 'Bold',
  value: '700'
}]

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
    name: 'header_size',
    label: 'Home Page Hero Header Size',
    type: 'string',
    options: HomeHeaderSizeOptions
  }, {
    name: 'page_header_size',
    label: 'Content Page Hero Header Size',
    type: 'string',
    options: PageHeaderSizeOptions
  }, {
    name: 'header_font_weight',
    label: 'Header Font Weight',
    type: 'string',
    options: HeaderFontWeightOptions
  }, {
    name: 'small_caps',
    label: 'Small Caps for hero and banner headers?',
    type: 'boolean'
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
    label: 'Secondary Color (accent)',
    type: 'string',
    ui: {
      component: 'color'
    }
  }, {
    name: 'tertiary_color',
    label: 'Tertiary Color (overlay)',
    type: 'string',
    ui: {
      component: 'color'
    }
  }, {
    name: 'background_color',
    label: 'Main background color',
    type: 'string',
    ui: {
      component: 'color'
    }
  }, {
    name: 'background_alternate',
    label: 'Alternate Background',
    type: 'string',
    ui: {
      component: 'color'
    }
  }, {
    name: 'content_color',
    label: 'Main Text Color for light background (defaults to black)',
    type: 'string',
    ui: {
      component: 'color'
    }
  }, {
    name: 'content_alternate',
    label: 'Alternate text color',
    type: 'string',
    ui: {
      component: 'color'
    }
  }, {
    name: 'content_inverse',
    label: 'Text on dark background (defaults to white)',
    type: 'string',
    ui: {
      component: 'color'
    }
  }, {
    name: 'content_inverse_alternate',
    label: 'Text on dark background alternate',
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
