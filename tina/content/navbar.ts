import { Collection, StringField } from '@tinacms/schema-tools';

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
    }
  ]
};

export default Navbar;
