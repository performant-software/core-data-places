import TinaMediaPicker from '../components/TinaMediaPicker';
import TinaPlacePicker from '../components/TinaPlacePicker';
import { Collection } from '@tinacms/schema-tools';

const Paths: Collection = {
  name: 'path',
  label: 'Paths',
  path: 'content/paths',
  format: 'mdx',
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