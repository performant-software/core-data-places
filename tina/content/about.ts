import { Collection } from '@tinacms/schema-tools';
import config from '@config';
import { TinaField } from 'tinacms';
import _ from 'underscore';

const textFields = (isBody: boolean): TinaField<false>[] => ([{
  type: 'string',
  name: 'title',
  label: 'Project Title',
}, {
  type: 'string',
  name: 'subheader',
  label: 'Subheader',
  ui: {
    component: 'textarea'
  }
}, {
  type: 'rich-text',
  name: 'description',
  label: 'Project Description',
  isBody: isBody
}]);

const localeFields: TinaField<false>[] = _.map(_.filter(config.i18n.locales, (lang) => (lang !== config.i18n.default_locale)), (lang) => ({
  name: lang,
  label: lang,
  type: 'object',
  fields: textFields(false)
}));

const About: Collection = {
  name: 'about',
  label: 'About the Project',
  path: 'content/about',
  format: 'mdx',
  fields: [
    ...textFields(true),
    ...localeFields,
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