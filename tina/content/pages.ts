import { Collection } from '@tinacms/schema-tools';
import _ from 'underscore';

const LABEL_SEPARATOR = ': ';

/**
 * Returns the label for the passed array of arguments.
 *
 * @param args
 */
const getLabel = (...args) => {
  return _.compact(args).join(LABEL_SEPARATOR);
};

const SpacerValues = {
  small: 'small',
  medium: 'medium',
  large: 'large'
};

const SpacerSizes = [{
  label: 'Small',
  value: SpacerValues.small
}, {
  label: 'Medium',
  value: SpacerValues.medium
}, {
  label: 'Large',
  value: SpacerValues.large
}];

const Pages: Collection = {
  name: 'pages',
  label: 'Pages',
  path: 'content/pages',
  format: 'mdx',
  fields: [{
    name: 'title',
    label: 'Title',
    type: 'string',
    isTitle: true,
    required: true
  }, {
    name: 'home_page',
    label: 'Home Page',
    type: 'boolean'
  }, {
    name: 'nav_bar',
    label: 'Navigation Menu',
    type: 'boolean'
  }, {
    name: 'sections',
    label: 'Sections',
    type: 'object',
    list: true,
    templates: [{
      name: 'carousel',
      label: 'Carousel',
      fields: [{
        name: 'items',
        label: 'Items',
        type: 'object',
        list: true,
        ui: {
          itemProps: (item) => {
            return { label: getLabel(item?.title) };
          }
        },
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
        }, {
          name: 'url',
          label: 'URL',
          type: 'string'
        }, {
          name: 'image',
          label: 'Image',
          type: 'image'
        }, {
          name: 'image_alt',
          label: 'Image Alt Text',
          type: 'string'
        }]
      }]
    }, {
      name: 'free_text',
      label: 'Free Text',
      fields: [{
        name: 'body',
        label: 'Body',
        type: 'rich-text',
        isBody: true
      }]
    }, {
      name: 'hero',
      label: 'Hero',
      ui: {
        itemProps: (item) => {
          return { label: getLabel('Hero', item?.title) };
        }
      },
      fields: [{
        name: 'title',
        label: 'Title',
        type: 'string'
      }, {
        name: 'subtitle',
        label: 'Subtitle',
        type: 'string',
        ui: {
          component: 'textarea'
        }
      }, {
        name: 'background_image',
        label: 'Background Image',
        type: 'image'
      }, {
        name: 'background_image_alt',
        label: 'Background Image Alt Text',
        type: 'string'
      }, {
        name: 'url',
        label: 'URL',
        type: 'string'
      }, {
        name: 'button_text',
        label: 'Button Text',
        type: 'string'
      }, {
        name: 'text_alignment',
        label: 'Text Alignment',
        type: 'string',
        options: [{
          label: 'Left',
          value: 'left'
        }, {
          label: 'Center',
          value: 'center'
        }]
      }, {
        name: 'height',
        label: 'Height',
        type: 'string',
        options: [{
          label: 'Small',
          value: 'small'
        }, {
          label: 'Medium',
          value: 'medium'
        }, {
          label: 'Large',
          value: 'large'
        }]
      }]
    }, {
      name: 'images',
      label: 'Images',
      ui: {
        itemProps: (item) => {
          return { label: getLabel('Images', item?.title) };
        }
      },
      fields: [{
        name: 'title',
        label: 'Title',
        type: 'string'
      }, {
        name: 'items',
        label: 'Items',
        type: 'object',
        list: true,
        ui: {
          itemProps: (item) => {
            return { label: getLabel(item?.url) };
          }
        },
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
        }, {
          name: 'citation',
          label: 'Image Citation Text',
          type: 'string'
        }, {
          name: 'citation_link',
          label: 'Image Citation Link',
          type: 'string'
        }]
      }]
    }, {
      name: 'spacer',
      label: 'Spacer',
      ui: {
        itemProps: (item) => {
          const size = _.findWhere(SpacerSizes, { value: item.size })?.label;
          return { label: getLabel('Spacer', size) };
        },
        defaultItem: {
          size: SpacerValues.small
        }
      },
      fields: [{
        name: 'size',
        label: 'Size',
        type: 'string',
        required: true,
        options: SpacerSizes
      }]
    }, {
      name: 'text_image',
      label: 'Text Image Block',
      ui: {
        itemProps: (item) => {
          return { label: getLabel('Text Image Block', item?.title) };
        }
      },
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
      }, {
        name: 'image',
        label: 'Image',
        type: 'image'
      }, {
        name: 'image_alt',
        label: 'Image Alt',
        type: 'string'
      },{
        name: 'url',
        label: 'URL',
        type: 'string'
      }, {
        name: 'citation',
        label: 'Image Citation Text',
        type: 'string'
      }, {
        name: 'citation_link',
        label: 'Image Citation Link',
        type: 'string'
      }, {
        name: 'background_position',
        label: 'Background Position',
        type: 'string',
        options: [{
          label: 'Top',
          value: 'top'
        }, {
          label: 'Bottom',
          value: 'bottom'
        }, {
          label: 'Left',
          value: 'left'
        }, {
          label: 'Right',
          value: 'right'
        }]
      }, {
        name: 'text_position',
        label: 'Text Position',
        type: 'string',
        options: [{
          label: 'Left',
          value: 'left'
        }, {
          label: 'Right',
          value: 'right'
        }]
      }, {
        name: 'button_text',
        label: 'Button Text',
        type: 'string'
      }]
    }, {
      name: 'multi_column',
      label: 'Multi Columns',
      ui: {
        itemProps: (item) => {
          return { label: getLabel('Multi-column', item?.title) };
        }
      },
      fields: [{
        name: 'title',
        label: 'Title',
        type: 'string'
      }, {
        name: 'url',
        label: 'URL',
        type: 'string'
      }, {
        name: 'button_text',
        label: 'Button Text',
        type: 'string'
      }, {
        name: 'text_alignment',
        label: 'Text Alignment',
        type: 'string',
        options: [{
          label: 'Left',
          value: 'left'
        }, {
          label: 'Center',
          value: 'center'
        }]
      }, {
        name: 'gap',
        label: 'Column Gap',
        type: 'string',
        options: [{
          label: 'Large',
          value: 'large'
        }, {
          label: 'Small',
          value: 'small'
        }]
      }, {
        name: 'columns',
        label: 'Columns',
        type: 'object',
        list: true,
        ui: {
          min: 1,
          max: 4
        },
        fields: [{
          name: 'width',
          label: 'Column width (percent)',
          type: 'string',
          options: [{
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
              type: 'rich-text'
            }]
          }, {
            name: 'image',
            label: 'Image',
            fields: [{
              name: 'image',
              label: 'Image',
              type: 'image'
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
          }]
        }]
      }]
    }]
  }]
};

export default Pages;