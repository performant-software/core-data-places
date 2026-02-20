import TinaPlacePicker from '../components/TinaPlacePicker';
import { Collection } from '@tinacms/schema-tools';
import Visualizations from '@root/tina/content/visualizations';
import _ from 'underscore';
import config from '@config';
import { media } from './common';

const Posts: Collection = {
  name: 'post',
  label: 'Posts',
  path: 'content/posts',
  format: 'mdx',
  fields: _.compact([
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
      type: 'image'
    },
    {
      name: 'imageAlt',
      label: 'Card Image alt text',
      type: 'string'
    },
    config.content?.posts_config?.categories && {
      name: 'category',
      label: 'Category',
      type: 'string',
      options: _.map(config.content?.posts_config?.categories, (cat) => ({
        label: cat,
        value: cat
      }))
    },
    config.content?.posts_config?.drafts &&     {
      name: 'publish',
      label: 'Publish',
      type: 'boolean'
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
        media,
        ...Visualizations
      ]
    },
  ]),
};

export default Posts;