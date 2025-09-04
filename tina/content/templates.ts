import TinaMediaPicker from '../components/TinaMediaPicker';
import TinaPlacePicker from '../components/TinaPlacePicker';
import Visualizations from '@root/tina/content/visualizations';

const commonTemplates = [
  {
    name: 'iframe',
    label: 'AV Embed',
    fields: [
      {
        name: 'src',
        label: 'Embed Link',
        type: 'string',
        required: true,
      },
      {
        name: 'width',
        label: 'Width (pixels)',
        type: 'number',
        ui: {
          parse: (val?: number) => val || 0,
          format: (val?: number) => (val === 0 ? null : val),
        },
      },
      {
        name: 'height',
        label: 'Height (pixels)',
        type: 'number',
        ui: {
          parse: (val?: number) => val || 0,
          format: (val?: number) => (val === 0 ? null : val),
        },
      },
    ],
  },
  {
    name: 'media',
    label: 'Media',
    fields: [
      {
        name: 'media',
        label: 'Media',
        type: 'object',
        fields: [
          {
            name: 'title',
            label: 'Title',
            type: 'string',
          },
          {
            name: 'uuid',
            label: 'UUID',
            type: 'string',
          },
          {
            name: 'manifest_url',
            label: 'Manifest URL',
            type: 'string',
          },
          {
            name: 'content_url',
            label: 'Content URL',
            type: 'string',
          },
          {
            name: 'content_preview_url',
            label: 'Content Preview URL',
            type: 'string',
          },
        ],
        ui: {
          component: TinaMediaPicker,
        },
      },
    ],
  },
];

export const pathTemplates = [...commonTemplates];
export const postTemplates = [
  ...commonTemplates,
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
            isTitle: true,
          },
          {
            name: 'uuid',
            label: 'UUID',
            type: 'string',
          },
          {
            name: 'animate',
            label: 'Animate pulsing place marker?',
            type: 'boolean',
          },
          {
            name: 'buffer',
            label: 'Map zoom buffer (in miles)',
            type: 'number',
          },
          {
            name: 'layer',
            label: 'Custom Map Layer',
            type: 'number',
            list: true,
          },
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
          component: 'textarea',
        },
      },
    ],
  },
  ...Visualizations,
];
