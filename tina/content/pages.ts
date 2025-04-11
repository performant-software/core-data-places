import { Collection } from '@tinacms/schema-tools';

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
    name: 'sections',
    label: 'Sections',
    type: 'object',
    list: true,
    templates: [{
      name: 'hero',
      label: 'Hero',
      fields: [{
        name: 'title',
        label: 'Title',
        type: 'string'
      }, {
        name: 'subtitle',
        label: 'Subtitle',
        type: 'string'
      }, {
        name: 'background_image',
        label: 'Background Image',
        type: 'image'
      }, {
        name: 'background_image_alt',
        label: 'Background Image Alt Text',
        type: 'string'
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
    }]
  }]
};

export default Pages;