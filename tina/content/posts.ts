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
};

/**
 * Accepts an array of non-default locales and returns the appropriate posts collection schema
 * @param locales An array of the non-default locales for the project
 * @returns `Posts` collection with localized content fields
 */
export const getPostsCollection = (locales: string[]) => {
  if (!locales || !locales.length) {
    return Posts;
  }
  const localizedContent = locales.map((key) => ({
    type: 'object',
    name: key.replaceAll('-', '_'),
    label: key,
    fields: [
      {
        type: 'string',
        name: 'title',
        label: 'Title',
      },
      {
        type: 'rich-text',
        name: 'body',
        label: 'Body',
      },
    ],
  }));
  return {
    name: Posts.name,
    label: Posts.label,
    path: Posts.path,
    format: Posts.format,
    fields: [...Posts.fields, ...localizedContent],
  } as Collection;
};

export default Posts;
