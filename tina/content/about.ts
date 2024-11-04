import { Collection } from '@tinacms/schema-tools';

const About: Collection = {
  name: 'about',
  label: 'About the Project',
  path: 'content/about',
  format: 'mdx',
  fields: [
    {
      type: 'string',
      name: 'title',
      label: 'Project Title',
    },
    {
      type: 'string',
      name: 'subheader',
      label: 'Subheader',
      ui: {
        component: 'textarea'
      }
    },
    {
      type: 'rich-text',
      name: 'description',
      label: 'Project Description',
      isBody: true
    },
    {
      type: 'image',
      name: 'heroImage',
      label: 'Hero Image'
    },
    {
      type: 'image',
      name: 'featureImage',
      label: 'Feature Image'
    }
  ],
  ui: {
    allowedActions: {
      create: false,
      delete: false
    }
  }
};

export default About;