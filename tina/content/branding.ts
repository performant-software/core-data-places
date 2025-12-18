import { Collection } from '@tinacms/schema-tools';
import { ColorOptions, ColorOptionsBg, ColorOptionsText, richTextTemplates } from './pages';

const Fonts = [{
  label: 'Afacad',
  value: 'Afacad'
}, {
  label: 'Baskervville',
  value: 'Baskervville'
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
    name: 'content_dark_bg',
    label: 'Text on dark background (defaults to white)',
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
      name: 'custom',
      label: 'Use custom footer?',
      type: 'boolean'
    }, {
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
    }, {
      name: 'custom_content',
      label: 'Custom Footer Content',
      type: 'object',
      fields: [{
        name: 'background',
        label: 'Background Color',
        type: 'string',
        options: ColorOptionsBg
      }, {
        name: 'text',
        label: 'Text Color',
        type: 'string',
        options: ColorOptionsText
      }, {
        name: 'columns',
        label: 'Columns',
        type: 'object',
        list: true,
        ui: {
          min: 1,
          max: 6
        },
        fields: [{
          name: 'width',
          label: 'Column width (percent)',
          type: 'string',
          options: [{
            label: '16.5%',
            value: 'col-span-2'
          }, {
            label: '25%',
            value: 'col-span-3'
          }, {
            label: '33%',
            value: 'col-span-4'
          }, {
            label: '50%',
            value: 'col-span-6'
          }, {
            label: '67%',
            value: 'col-span-8'
          }, {
            label: '75%',
            value: 'col-span-9'
          }, {
            label: '100%',
            value: 'col-span-12'
          }]
        }, {
          name: 'justify',
          label: 'Vertical Alignment',
          type: 'string',
          options: [{
            label: 'Top (default)',
            value: 'justify-start'
          }, {
            label: 'Center',
            value: 'justify-center'
          }, {
            label: 'Bottom',
            value: 'justify-end'
          }]
        }, {
          name: 'align',
          label: 'Horizontal Alignment',
          type: 'string',
          options: [{
            label: 'Left (default)',
            value: ''
          }, {
            label: 'Center',
            value: 'items-center text-center'
          }, {
            label: 'Bottom',
            value: 'justify-end'
          }]         
        }, {
          name: 'border',
          label: 'Border Color (leave blank for none)',
          type: 'string',
          options: ColorOptions
        }, {
          name: 'rounded',
          label: 'Rounded Corners?',
          type: 'boolean'
        }, {
          name: 'content',
          label: 'Content',
          type: 'object',
          list: true,
          templates: [{
            name: 'richtext',
            label: 'Rich Text',
            fields: [{
              name: 'text',
              label: 'Text',
              type: 'rich-text',
              templates: richTextTemplates
            }]
          }, {
            name: 'image',
            label: 'Image',
            fields: [{
              name: 'image',
              label: 'Image',
              type: 'image'
            }, {
              name: 'rounded',
              label: 'Rounded Corners?',
              type: 'boolean'
            }]
          }, {
            name: 'basic',
            label: 'Title and Description (plain text)',
            fields: [{
              name: 'title',
              label: 'Title',
              type: 'string'
            }, {
              name: 'description',
              label: 'Description',
              type: 'string',
              ui: {
                component: 'textarea'
              }
            }]
          }, {
            name: 'card',
            label: 'Card Link',
            fields: [{
              name: 'slug',
              label: 'Link',
              type: 'string'
            }, {
              name: 'title',
              label: 'Title',
              type: 'string'
            }, {
              name: 'author',
              label: 'Author',
              type: 'string'
            }, {
              name: 'date',
              label: 'Date',
              type: 'datetime'
            }, {
              name: 'category',
              label: 'Category',
              type: 'string'
            }, {
              name: 'image',
              label: 'Image',
              type: 'image',
            }, {
              name: 'alt',
              label: 'Image Alt Text',
              type: 'string'
            }, {
              name: 'blurb',
              label: 'Blurb',
              type: 'string',
              ui: {
                component: 'textarea'
              }
            }]
          }, {
            name: 'image_link',
            label: 'Image Link',
            fields: [{
              name: 'image',
              label: 'Image',
              type: 'image'
            }, {
              name: 'link',
              label: 'Link',
              type: 'string'
            }, {
              name: 'overlay',
              label: 'Overlay Text',
              type: 'string'
            }]
          }, {
            name: 'quote',
            label: 'Quotation Card',
            fields: [{
              name: 'quote',
              label: 'Quotation Text',
              type: 'string',
              ui: {
                component: 'textarea'
              }
            }, {
              name: 'attribution',
              label: 'Attribution',
              type: 'string'
            }, {
              name: 'text_color',
              label: 'Text Color',
              type: 'string',
              options: ColorOptionsText
            }, {
              name: 'border_color',
              label: 'Border Color',
              type: 'string',
              options: ColorOptionsBg
            }, {
              name: 'icon',
              label: 'Icon',
              type: 'image'
            }]
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

export default Branding;
