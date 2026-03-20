import _ from 'underscore';
import Creator from '../components/Creator';
import PublishToggle from '../components/PublishToggle';
import TinaMediaPicker from '../components/TinaMediaPicker';
import TinaPlacePicker from '../components/TinaPlacePicker';
import { Collection, TinaField } from '@tinacms/schema-tools';
import config from '@config';

export const pathMetadata: TinaField<false>[] = _.compact([
  {
    type: 'object',
    name: 'creator',
    label: 'Creator',
    fields: [{
      name: 'id',
      label: 'ID',
      type: 'string'
    }, {
      name: 'email',
      label: 'Email',
      type: 'string'
    }],
    ui: {
      component: Creator
    }
  },
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
  config.content?.paths_config?.categories && {
    name: 'category',
    label: 'Category',
    type: 'string',
    options: _.map(config.content?.paths_config?.categories, (cat) => ({
      label: cat,
      value: cat
    }))
  },
  {
    name: 'published',
    label: 'Published',
    type: 'boolean',
    ui: {
      component: PublishToggle
    }
  }]
);

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
    beforeSubmit: (arg: { values, form, cms }) => {
      const user = arg.cms?.api?.tina?.authProvider?.clerk?.user; // update this to also work for native tina auth?
      if (!arg.values.creator && user) {
        arg.values.creator = {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress
        };
      }
      return arg.values;
    }
  },
  fields: [
    ...pathMetadata, 
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