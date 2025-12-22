import { Collection, StringField } from '@tinacms/schema-tools';

const baseFields: StringField[] = [{
  name: 'label',
  label: 'Label',
  type: 'string',
  required: true
}, {
  name: 'href',
  label: 'URL',
  type: 'string',
  description: 'Use a relative URL such as /en/about'
}];

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
      fields: [...baseFields,
      {
        name: 'options',
        label: 'Dropdown Items',
        type: 'object',
        list: true,
        fields: baseFields,
        ui: {
          itemProps,
        },
      }],
      ui: {
        itemProps,
      },
    }
  ]
};

export default Navbar;
