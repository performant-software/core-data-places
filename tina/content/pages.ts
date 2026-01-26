import { Collection, RichTextTemplate, Template, TinaField } from '@tinacms/schema-tools';
import _ from 'underscore';

const LABEL_SEPARATOR = ': ';

/**
 * Returns the label for the passed array of arguments.
 *
 * @param args
 */
export const getLabel = (...args) => {
  return _.compact(args).join(LABEL_SEPARATOR);
};

const SpacerValues = {
  none: 'none',
  xsmall: 'xs',
  small: 'small',
  medium: 'medium',
  large: 'large'
};

export const ColorValues = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  layout: 'layout',
  layoutAlternate: 'layout_alternate',
  contentLight: 'content_light',
  contentDark: 'content_dark',
  contentAlternate: 'text-content-alt',
  contentMain: 'text-content'
};

const SpacerSizes = [{
  label: 'None (divider only)',
  value: SpacerValues.none
}, {
  label: 'Extra Small (20px)',
  value: SpacerValues.xsmall
}, {
  label: 'Small (32px)',
  value: SpacerValues.small
}, {
  label: 'Medium (64px)',
  value: SpacerValues.medium
}, {
  label: 'Large (96px)',
  value: SpacerValues.large
}];

export const ColorOptionsBg = [{
  label: 'Primary',
  value: ColorValues.primary
}, {
  label: 'Main Background',
  value: ColorValues.layout 
}, {
  label: 'Alternate Background',
  value: ColorValues.layoutAlternate
}];

export const ColorOptionsText = [{
  label: 'Main',
  value: ColorValues.contentMain
}, {
  label: 'Alternate',
  value: ColorValues.contentAlternate
}];

export const ColorOptionsBorder = [{
  label: 'Secondary',
  value: ColorValues.secondary
}];

export const ColorOptionsButton = [{
  label: 'Primary',
  value: ColorValues.primary
}, {
  label: 'Secondary',
  value: ColorValues.secondary
}, {
  label: 'Main Background',
  value: ColorValues.layout
}];

export const ColorOptions = [{
  label: 'Primary',
  value: ColorValues.primary
}, {
  label: 'Secondary',
  value: ColorValues.secondary
}, {
  label: 'Tertiary',
  value: ColorValues.tertiary
}, {
  label: 'Content (light background)',
  value: ColorValues.contentDark
}, {
  label: 'Content (dark background)',
  value: ColorValues.contentLight
}, {
  label: 'Alternate Content',
  value: ColorValues.contentAlternate
}, {
  label: 'Main Background',
  value: ColorValues.layout 
}, {
  label: 'Alternate Background',
  value: ColorValues.layoutAlternate
}];

export const richTextTemplates: RichTextTemplate<false>[] = [{
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
    options: ColorOptionsBorder
  }]
}, {
  name: 'button',
  label: 'Button Link',
  fields: [{
    name: 'content',
    label: 'Button Text',
    type: 'string'
  }, {
    name: 'href',
    label: 'Button Link',
    type: 'string'
  }, {
    name: 'color',
    label: 'Color',
    type: 'string',
    options: ColorOptionsButton
  }, {
    name: 'text',
    label: 'Text Color',
    type: 'string',
    description: 'Leave blank for default.',
    options: ColorOptionsButton
  }, {
    name: 'border',
    label: 'Border Color (leave blank for none)',
    type: 'string',
    options: ColorOptionsButton
  }, {
    name: 'arrow',
    label: 'Include arrow icon?',
    type: 'boolean'
  }]
}];

const contactForm: Template = {
  name: 'contact_form',
  label: 'Contact Form',
  fields: [{
    name: 'email',
    label: 'Email',
    type: 'string'
  }]
};

const commonSectionFields: TinaField<false>[] = [{
  name: 'id',
  label: 'Section Identifier',
  type: 'string',
  description: 'This identifier does not appear on the published page; it is just for your convenience to distinguish this section in the section list.'
}, {
  name: 'background',
  label: 'Background Color',
  type: 'string',
  options: ColorOptionsBg
}, {
  name: 'top_margin',
  label: 'Top Margin',
  description: 'Note: Negative margin will raise the section to overlap with the previous section. Leave blank for none.',
  type: 'string',
  options: [{
    label: 'Negative XXL (-192px)',
    value: '-mt-[192px]'
  }, {
    label: 'Negative XL (-96px)',
    value: '-mt-[96px]'
  }, {
    label: 'Negative Large (-80px)',
    value: '-mt-[80px]'
  }, {
    label: 'Negative Medium (-64px)',
    value: '-mt-[64px]'
  }, {
    label: 'Negative Small (-32px)',
    value: '-mt-[32px]'
  }, {
    label: 'Small (32px)',
    value: 'pt-[16px] lg:pt-[32px]'
  }, {
    label: 'Medium (64px)',
    value: 'pt-[32px] lg:pt-[64px]'
  }, {
    label: 'Large (80px)',
    value: 'pt-[48px] lg:pt-[80px]'
  }, {
    label: 'XL (96px)',
    value: 'pt-[64px] lg:pt-[96px]'
  }, {
    label: 'XXL (192px)',
    value: 'pt-[128px] lg:pt-[192px]'
  }]
}, {
  name: 'bottom_margin',
  label: 'Bottom Margin',
  type: 'string',
  options: [{
    label: 'Small (32px)',
    value: 'pb-[16px] lg:pb-[32px]'
  }, {
    label: 'Medium (64px)',
    value: 'pb-[32px] lg:pb-[64px]'
  }, {
    label: 'Large (80px)',
    value: 'pb-[48px] lg:pb-[80px]'
  }, {
    label: 'XL (96px)',
    value: 'pb-[64px] lg:pb-[96px]'
  }, {
    label: 'XXL (192px)',
    value: 'pb-[128px] lg:pb-[192px]'
  }]
}];

const staticSectionTemplates: Template<false>[] = [{
  name: 'free_text',
  label: 'Free Text',
  ui: {
    itemProps: (item) => {
      return { label: getLabel('Free Text', item?.id) };
    }
  },
  fields: [...commonSectionFields, {
    name: 'body',
    label: 'Body',
    type: 'rich-text',
    isBody: true,
    templates: richTextTemplates
  }]
}, {
  name: 'images',
  label: 'Images',
  ui: {
    itemProps: (item) => {
      return { label: getLabel('Images', item?.title) };
    }
  },
  fields: [...commonSectionFields, {
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
      const bgcolor = _.findWhere(ColorOptionsBg, { value: item.background })?.label;
      const color = _.findWhere(ColorOptionsBorder, { value: item.color })?.label;
      return { label: getLabel('Spacer', size, bgcolor && 'Background', bgcolor, color && 'Line Color', color) };
    },
    defaultItem: {
      size: SpacerValues.small
    }
  },
  fields: [...commonSectionFields, {
    name: 'size',
    label: 'Size',
    type: 'string',
    required: true,
    options: SpacerSizes
  }, {
    name: 'color',
    label: 'Color',
    type: 'string',
    options: ColorOptionsBorder
  }]
}, {
  name: 'multi_column',
  label: 'Multi Columns',
  ui: {
    itemProps: (item) => {
      return { label: getLabel('Multi-column', item?.id || item?.title) };
    }
  },
  fields: [...commonSectionFields, {
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
      label: 'Small (default)',
      value: 'small'
    }, {
      label: 'None',
      value: 'none'
    }]
  }, {
    name: 'text',
    label: 'Text Color',
    type: 'string',
    options: ColorOptionsText
  }, {
    name: 'background_image',
    label: 'Background Image',
    type: 'image'
  }, {
    name: 'darken',
    label: 'Darken Background Image?',
    type: 'boolean'
  }, {
    name: 'columns',
    label: 'Columns',
    type: 'object',
    list: true,
    ui: {
      min: 1,
      max: 6,
      itemProps: (item) => {
        const types = item?.content?.length && _.map(item.content, (block) => (block._template)).join(', ')
        return ({ label: getLabel('Column', types) });
      }
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
      name: 'background',
      label: 'Background Color',
      type: 'string',
      options: ColorOptionsBg
    }, {
      name: 'border',
      label: 'Border Color (leave blank for none)',
      type: 'string',
      options: ColorOptionsBorder
    }, {
      name: 'rounded',
      label: 'Rounded Corners?',
      type: 'boolean'
    }, {
      name: 'url',
      label: 'URL',
      description: 'If provided, the entire column will be a link to the given URL.',
      type: 'string'
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
        }, {
          name: 'size',
          label: 'Paragraph Text Size',
          type: 'string',
          options: [{
            label: 'Default (16px)',
            value: ''
          }, {
            label: 'Large (18px)',
            value: 'text-lg'
          }, {
            label: 'Small (14px)',
            value: 'text-sm'
          }]
        }, {
          name: 'padding',
          label: 'Add side padding?',
          description: 'If selected, will add a small buffer around the left and right of the text; for example if the text will be inside a border.',
          type: 'boolean'
        }]
      }, {
        name: 'image',
        label: 'Image',
        ui: {
          defaultItem: {
            'full_height': true
          }
        },
        fields: [{
          name: 'image',
          label: 'Image',
          type: 'image'
        }, {
          name: 'full_height',
          label: 'Full height?',
          type: 'boolean'
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
      }, {
        name: 'counter',
        label: 'Record Counter',
        fields: [{
          name: 'count',
          label: 'Record Count',
          type: 'number'
        }, {
          name: 'type',
          label: 'Type (defaults to "records")',
          type: 'string'
        }, {
          name: 'description',
          label: 'Description',
          type: 'string'
        }]
      }, contactForm]
    }]
  }]
}, {
  name: 'banner',
  label: 'Full Width Banner',
  ui: {
    itemProps: (item) => {
      return { label: getLabel('Full Width Banner', item?.id || item?.title) };
    }
  },
  fields:  [...commonSectionFields, {
    name: 'hero',
    label: 'Is hero?',
    type: 'boolean'
  }, {
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
      name: 'search_name',
      label: 'Search Name',
      description: 'This should match the name configured for the search in Settings.',
      type: 'string'
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
    name: 'content',
    label: 'Rich Text Content',
    type: 'rich-text',
    templates: richTextTemplates
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
  }, {
    name: 'color',
    label: 'Text Mode',
    type: 'string',
    options: [{
      label: 'Dark Text',
      value: 'black'
    }, {
      label: 'Light Text',
      value: 'white'
    }]
  }, {
    name: 'background_image',
    label: 'Background Image',
    type: 'image'
  }, {
    name: 'background_image_alt',
    label: 'Background Image Alt Text',
    type: 'string'
  }, {
    name: 'darken',
    label: 'Darken Background?',
    type: 'boolean'
  }]
}, {
  name: 'feature_quote',
  label: 'Feature Quote',
  ui: {
    itemProps: (item) => {
      return { label: getLabel('Feature Quote', item?.id || item?.attribution) };
    }
  },
  fields: [...commonSectionFields, {
    name: 'text',
    label: 'Text Color',
    type: 'string',
    options: ColorOptionsText
  }, {
    name: 'background_image',
    label: 'Background Image',
    type: 'image'
  }, {
    name: 'darken',
    label: 'Darken Background Image?',
    type: 'boolean'
  }, {
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
    name: 'date',
    label: 'Date',
    type: 'string'
  }, {
    name: 'icon',
    label: 'Icon',
    type: 'image'
  }]
}, {
  name: 'text_image',
  label: 'Text Image Block',
  ui: {
    itemProps: (item) => {
      return { label: getLabel('Text Image Block', item?.id || item?.title) };
    }
  },
  fields: [...commonSectionFields, {
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
  name: 'link_banner',
  label: 'Links Banner',
  ui: {
    itemProps: (item) => {
      return { label: getLabel('Links Banner', item?.id) };
    }
  },
  fields: [...commonSectionFields, {
    name: 'link_background',
    label: 'Link Background Color',
    type: 'string',
    options: ColorOptionsButton
  }, {
    name: 'links',
    label: 'Links',
    list: true,
    type: 'object',
    fields: [{
      name: 'label',
      label: 'Label',
      type: 'string'
    }, {
      name: 'url',
      label: 'URL',
      type: 'string'
    }]
  }]
}, contactForm];

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
    name: 'transparent',
    label: 'Make top navbar transparent?',
    type: 'boolean'
  }, {
    name: 'sections',
    label: 'Sections',
    type: 'object',
    list: true,
    templates: [...staticSectionTemplates, {
      name: 'carousel',
      label: 'Carousel',
      fields: [...commonSectionFields, {
        name: 'items',
        label: 'Items',
        type: 'object',
        list: true,
        ui: {
          itemProps: (item) => {
            return { label: getLabel('Carousel', item?.id || item?.title) };
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
      name: 'tabs',
      label: 'Tabbed Content',
      ui: {
        itemProps: (item) => {
          return { label: getLabel('Tabbed Content', item?.id) };
        }
      },
      fields: [...commonSectionFields, {
        name: 'invert_text',
        label: 'Default to light text color for tabs with no specified background color?',
        description: 'For tabs that overlap with the section above, select this option if the section above has a dark background.',
        type: 'boolean'
      }, {
        name: 'active_bg',
        label: 'Active Tab Background Color',
        type: 'string',
        options: ColorOptionsBg
      }, {
        name: 'inactive_bg',
        label: 'Inactive Tab Background Color (defaults to none)',
        type: 'string',
        options: ColorOptionsBg
      }, {
        name: 'text_style',
        label: 'Tab Label Styling',
        type: 'string',
        options: [{
          label: 'Small Uppercase',
          value: 'uppercase'
        }, {
          label: 'Italic Serif',
          value: 'italic'
        }]
      }, {
        name: 'tabs',
        label: 'Tabs',
        type: 'object',
        list: true,
        ui: {
          itemProps: (item) => ({ label: getLabel('Tab Item', item?.label)})
        },
        fields: [{
          name: 'label',
          label: 'Tab Label',
          type: 'string'
        }, {
          name: 'content',
          label: 'Tab Content',
          type: 'object',
          list: true,
          templates: staticSectionTemplates
        }]
      }]
    }]
  }]
};

export default Pages;