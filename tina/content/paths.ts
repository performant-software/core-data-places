import TinaPlacePicker from '../components/TinaPlacePicker';
import { Collection } from '@tinacms/schema-tools';
import { pathTemplates } from './templates';
import type { RichTextTemplate } from '@tinacms/schema-tools';

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
      name: 'description',
      label: 'Description',
      type: 'rich-text',
      isBody: true,
      templates: pathTemplates as RichTextTemplate<false>[]
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
          templates: pathTemplates as RichTextTemplate<false>[]
        }
      ]
    }
  ]
};

export default Paths;