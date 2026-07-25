import { Collection } from '@tinacms/schema-tools';
import { TinaField } from 'tinacms';
import i18n from '../../src/i18n/i18n.json';
import userDefinedFields from '../../src/i18n/userDefinedFields.json';
import search from '../../src/i18n/search.json';
import { getTranslationKey } from '../../src/i18n/utils';
import { commonCollectionFields } from './common';

const allFields = {
  ...i18n,
  ...userDefinedFields,
  ...search
};

const fields: TinaField<false>[] = Object.keys(allFields).map((key: string) => ({
  name: getTranslationKey(key),
  label: allFields[key].tinaLabel,
  type: 'string',
  ui: {
    //@ts-ignore
    component: allFields[key]?.textArea ? 'textarea' : 'text'
  }
}));

const I18n: Collection = {
  name: 'i18n',
  format: 'json',
  label: 'Internationalization',
  path: 'content/i18n',
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
  fields: [...fields, ...commonCollectionFields]
};

export default I18n;