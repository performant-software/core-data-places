import TinaMediaPicker from '../components/TinaMediaPicker';
import TinaPlacePicker from '../components/TinaPlacePicker';
import { Collection } from '@tinacms/schema-tools';

const Paths: Collection = {
  name: 'path',
  label: 'Paths',
  path: 'content/paths',
  format: 'mdx',
  ui: {
    async router({ document }) {
      const str = document._sys.filename + process.env.TINA_PUBLIC_HASH_KEY;
      const buffer = new TextEncoder().encode(str);
      const hash = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = new Uint8Array(hash);
      const hashHex = Array.from(hashArray)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
      return `/en/paths/${hashHex}/preview/${document._sys.filename}`;
    },
    beforeSubmit: async ({ values, cms }: any) => {
      const user = await cms.authProvider?.getUser?.();
      if (user?.id && !values.owner_id) {
        values.owner_id = user.id;
        values.owner_name = user.fullName || user.primaryEmailAddress?.emailAddress || '';
      }
      return values;
    },
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'string',
      required: true,
      isTitle: true,
    },
    {
      name: 'image',
      label: 'Cover Image',
      type: 'image'
    },
    {
      name: 'imageAlt',
      label: 'Cover Image alt text',
      type: 'string'
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
      name: 'published',
      label: 'Published',
      type: 'boolean',
      ui: { component: 'PublishedToggle' }
    },
    {
      name: 'owner_id',
      type: 'string',
      ui: { component: () => null }
    },
    {
      name: 'owner_name',
      label: 'Created by',
      type: 'string',
      ui: { component: 'ReadOnlyText' }
    },
    {
      name: 'description',
      label: 'Description',
      type: 'rich-text',
      isBody: true,
      templates: [
        {
          name: 'iframe',
          label: 'AV Embed',
          fields: [
            {
              name: 'src',
              label: 'Embed Link',
              type: 'string',
              required: true
            },
            {
              name: 'width',
              label: 'Width (pixels)',
              type: 'number',
              ui: {
                parse: (val?: number)=>val || 0,
                format: (val?: number)=> val === 0 ? null : val
              }
            },
            {
              name: 'height',
              label: 'Height (pixels)',
              type: 'number',
              ui: {
                parse: (val?: number)=>val || 0,
                format: (val?: number)=> val === 0 ? null : val
              }
            }
          ]
        },
        {
          name: "media",
          label: "Media",
          fields: [
            {
              name: "media",
              label: "Media",
              type: "object",
              fields: [
                {
                  name: "title",
                  label: "Title",
                  type: "string",
                },
                {
                  name: "uuid",
                  label: "UUID",
                  type: "string"
                },
                {
                  name: "manifest_url",
                  label: "Manifest URL",
                  type: "string"
                },
                {
                  name: "content_url",
                  label: "Content URL",
                  type: "string"
                },
                {
                  name: "content_preview_url",
                  label: "Content Preview URL",
                  type: "string"
                }
              ],
              ui: {
                component: TinaMediaPicker
              }
            }
          ]
        }
      ]
    },
    {
      name: 'path',
      type: 'object',
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.place?.title}
        }
      },
      fields: [
        {
          name: 'place',
          label: 'Place Data',
          type: 'object',
          fields: [
            {
              name: 'title',
              label: 'Title',
              type: 'string',
              required: true,
              isTitle: true
            },
            {
              name: 'uuid',
              label: 'UUID',
              type: 'string',
            },
            {
              name: 'animate',
              label: 'Animate pulsing place marker?',
              type: 'boolean'
            },
            {
              name: 'buffer',
              label: 'Map zoom buffer (in miles)',
              type: 'number'
            },
            {
              name: 'layer',
              label: 'Custom Map Layer',
              type: 'number',
              list: true
            }
          ],
          ui: {
            component: TinaPlacePicker,
          },
          required: true,
        },
        {
          name: 'blurb',
          label: 'Blurb',
          type: 'rich-text',
          templates: [
            {
              name: 'iframe',
              label: 'AV Embed',
              fields: [
                {
                  name: 'src',
                  label: 'Embed Link',
                  type: 'string',
                  required: true
                },
                {
                  name: 'width',
                  label: 'Width (pixels)',
                  type: 'number',
                  ui: {
                    parse: (val?: number)=>val || 0,
                    format: (val?: number)=> val === 0 ? null : val
                  }
                },
                {
                  name: 'height',
                  label: 'Height (pixels)',
                  type: 'number',
                  ui: {
                    parse: (val?: number)=>val || 0,
                    format: (val?: number)=> val === 0 ? null : val
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default Paths;