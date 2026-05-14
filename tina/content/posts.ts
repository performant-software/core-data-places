import TinaPlacePicker from '../components/TinaPlacePicker';
import { Collection, TinaField } from '@tinacms/schema-tools';
import Visualizations from '@root/tina/content/visualizations';
import Creator from '../components/Creator';
import NotEditableNotice from '../components/NotEditableNotice';
import _ from 'underscore';
import config from '@config';
import { media } from './common';
import PublishToggle from '../components/PublishToggle';
import { getUserRole } from '../utils/getUserRole';

export const postMetadata: TinaField<false>[] = _.compact([
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
  config.content?.posts_config?.categories && {
    name: 'category',
    label: 'Category',
    type: 'string',
    options: _.map(config.content?.posts_config?.categories, (cat) => ({
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
  }
]);

const Posts: Collection = {
  name: 'post',
  label: 'Posts',
  path: 'content/posts',
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
      return `/en/posts/${hashHex}/preview/${document._sys.filename}`;
    },
    beforeSubmit: (arg: { values, form, cms }) => {
      const { isAdmin, userId } = getUserRole(arg.cms);

      // Block saves for non-owners
      if (!isAdmin && arg.values.creator?.id && arg.values.creator.id !== userId) {
        throw new Error('You can only edit content you created.');
      }

      // Auto-populate creator on first save
      const user = arg.cms?.api?.tina?.authProvider?.clerk?.user;
      if (!arg.values.creator && user) {
        arg.values.creator = {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress
        };
      }
      return arg.values;
    }
  },
  fields: _.compact([
    {
      name: '_notEditableNotice',
      type: 'string',
      ui: {
        component: NotEditableNotice
      }
    },
    ...postMetadata,
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
        media,
        ...Visualizations
      ]
    },
  ]),
};

export default Posts;