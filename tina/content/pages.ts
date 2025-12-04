import { Collection, RichTextTemplate } from '@tinacms/schema-tools';
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

const ModelNames = {
  events: 'events',
  instances: 'instances',
  items: 'items',
  mediaContents: 'media_contents',
  organizations: 'organizations',
  people: 'people',
  places: 'places',
  works: 'works'
};

const SpacerValues = {
  small: 'small',
  medium: 'medium',
  large: 'large'
};

const colorValues = {
  black: 'black',
  white: 'white',
  primary: 'primary',
  secondary: 'secondary'
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

const colorOptions = [{
  label: 'White',
  value: colorValues.white
}, {
  label: 'Black',
  value: colorValues.black
}, {
  label: 'Primary',
  value: colorValues.primary
}, {
  label: 'Secondary (defaults to off-white)',
  value: colorValues.secondary
}];

const modelOptions = [{
  label: 'Events',
  value: ModelNames.events
}, {
  label: 'Instances',
  value: ModelNames.instances
}, {
  label: 'Items',
  value: ModelNames.items 
}, {
  label: 'Media Contents',
  value: ModelNames.mediaContents
}, {
  label: 'Organizations',
  value: ModelNames.organizations
}, {
  label: 'People',
  value: ModelNames.people
}, {
  label: 'Places',
  value: ModelNames.places
}, {
  label: 'Works',
  value: ModelNames.works
}]

const richTextTemplates: RichTextTemplate<false>[] = [{
  name: 'spacer',
  label: 'Spacer',
  fields: [{
    name: 'size',
    label: 'Size',
    type: 'string',
    options: SpacerSizes
  }, {
    name: 'color',
    label: 'Color',
    type: 'string',
    options: colorOptions
  }]
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
        isBody: true,
        templates: richTextTemplates
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
        name: 'search',
        label: 'Search Bar',
        type: 'object',
        fields: [{
          name: 'model',
          label: 'Search Model',
          type: 'string',
          options: modelOptions
        }, {
          name: 'button_text',
          label: 'Button Text',
          type: 'string'
        }, {
          name: 'placeholder',
          label: 'Search Placeholder',
          type: 'string'
        }]
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
      }, {
        name: 'color',
        label: 'Color',
        type: 'string',
        options: colorOptions
      }]
    }, {
      name: 'text_block',
      label: 'Text Block',
      ui: {
        itemProps: (item) => {
          return { label: getLabel('Text Block', item?.title) };
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
        name: 'items',
        label: 'Items',
        type: 'object',
        list: true,
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
    }]
  }]
};

export default Pages;