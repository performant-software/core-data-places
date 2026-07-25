import { Collection, StringField } from '@tinacms/schema-tools';
import { commonCollectionFields } from './common';

const labelField: StringField = {
  name: 'label',
  label: 'Label',
  type: 'string',
  required: true
};

const urlField: StringField = {
  name: 'href',
  label: 'URL',
  type: 'string',
  description: 'If you\'re linking to a page on this website, use a relative URL such as /en/about',
  required: true
};

const itemProps = (item) => {
  return { label: item?.label };
}

const Navbar: Collection = {
  name: 'navbar',
  label: 'Navbar',
  path: 'content/navbar',
  format: 'json',
  ui: {
    beforeSubmit: (arg: { values, form, cms }) => {
      const user = arg.cms?.api?.tina?.authProvider?.clerk?.user;

      // Log edit history
      arg.values.history ||= [];
      arg.values.history = [
        { 
          user_id: user.id, 
          user_email: user.primaryEmailAddress?.emailAddress, 
          timestamp: new Date().toISOString()
        },
        ...arg.values.history
      ];
      return arg.values;
    },
  },
  fields: [
    {
      name: 'items',
      label: 'Navigation Items',
      type: 'object',
      list: true,
      templates: [
        {
          name: 'URL',
          fields: [
            labelField,
            urlField
          ],
          ui: {
            itemProps,
          }
        },
        {
          name: 'Dropdown',
          fields: [
            labelField,
            {
              name: 'options',
              label: 'Dropdown Items',
              type: 'object',
              list: true,
              fields: [
                labelField,
                urlField
              ],
              ui: {
                itemProps,
              },
            }
          ],
          ui: {
            itemProps,
          }
        }
      ],
    },
    ...commonCollectionFields
  ]
};

export default Navbar;
