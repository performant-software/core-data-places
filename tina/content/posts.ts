import { Collection } from '@tinacms/schema-tools';
import { postTemplates } from './templates';
import type { RichTextTemplate } from '@tinacms/schema-tools';

const Posts: Collection = {
  name: 'post',
  label: 'Posts',
  path: 'content/posts',
  format: 'mdx',
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Title',
      isTitle: true,
      required: true,
    },
    {
      name: 'author',
      label: 'Author',
      type: 'string'
    },
    {
      name: 'date',
      label: 'Date',
      type: 'datetime'
    },
    {
      name: 'cardImage',
      label: 'Card Image',
      type: 'image',
    },
    {
      name: 'imageAlt',
      label: 'Card Image alt text',
      type: 'string',
    },
    {
      type: 'rich-text',
      name: 'body',
      label: 'Body',
      isBody: true,
      templates: postTemplates as RichTextTemplate<false>[],
    },
  ],
  ui: {
    allowedActions: {
      createNestedFolder: true
    }
  }
};

export default Posts;
