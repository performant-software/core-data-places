import TinaPlacePicker from '../components/TinaPlacePicker';
import { Collection } from '@tinacms/schema-tools';

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
      name: 'cardImage',
      label: 'Card Image',
      type: 'image'
    },
    {
      name: 'imageAlt',
      label: 'Card Image alt text',
      type: 'string'
    },
    {
      type: 'rich-text',
      name: 'body',
      label: 'Body',
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
          name: 'place',
          label: 'Place',
          fields: [
            {
              name: 'title',
              label: 'Title',
              type: 'string',
              required: true,
              isTitle: true,
            },
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
              name: 'caption',
              label: 'Caption',
              type: 'string',
              ui: {
                component: 'textarea'
              }
            }
          ],
        },
      ]
    },
  ],
};

export default Posts;