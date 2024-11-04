import { Collection } from '@tinacms/schema-tools';
import { TinaField } from 'tinacms';
import i18n from '../../src/i18n/i18n.json';
import userDefinedFields from '../../src/i18n/userDefinedFields.json';
import { getTranslationKey } from '../../src/i18n/utils';

const allFields = {
  ...i18n,
  ...userDefinedFields
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
  fields
};

export default I18n;