import { defineConfig, LocalAuthProvider } from 'tinacms';
import _ from 'underscore';
import config from '../public/config.json';
import Branding from './content/branding';
import I18n from './content/i18n';
import Navbar from './content/navbar';
import PagesCollection from './content/pages';
import PathsCollection from './content/paths';
import PostsCollection from './content/posts';
import Settings from './content/settings';
import { CustomAuthProvider } from './auth-provider';
import { TinaUserCollection, UsernamePasswordAuthJSProvider } from 'tinacms-authjs/dist/tinacms';
import client from '@tina/client';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';
const localContentPath = process.env.TINA_LOCAL_CONTENT_PATH;
const useSSO = process.env.TINA_PUBLIC_AUTH_USE_KEYCLOAK === 'true';

console.dir(TinaUserCollection);

const tinaUserFields = _.first(TinaUserCollection.fields);
const test = {
  ...tinaUserFields,
  fields: [
    ...tinaUserFields.fields,
    {
      name: 'user_role',
      label: 'Role',
      type: 'string',
      options: [{
        label: 'Admin',
        value: 'Admin',
      }, {
        label: 'Student',
        value: 'Student'
      }]
    }
  ]
};
console.log(tinaUserFields);

export default defineConfig({
  cmsCallback: async (cms) => {
    const { authProvider } = cms.api.tina;
    const user = await authProvider.getUser();

    console.log(cms);

    if (user.user_role !== 'Admin') {
      cms.api.tina.schema.schema.collections = _.filter(cms.api.tina.schema.schema.collections, (c) => c.name !== 'pages');
    }
  },
  authProvider: new UsernamePasswordAuthJSProvider(),
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  contentApiUrlOverride: '/api/tina/gql',
  localContentPath,
  media: {
    loadCustomStore: async () => {
      const pack = await import('next-tinacms-s3');
      return pack.TinaCloudS3MediaStore;
    }
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: _.compact([
      !useSSO
        ? {
          ...TinaUserCollection,
          fields: [
            test
          ]
        }
        : undefined,
      Branding,
      PagesCollection,
      config.content?.collections?.includes('paths')
        ? PathsCollection
        : undefined,
      config.content?.collections?.includes('posts')
        ? PostsCollection
        : undefined,
      I18n,
      Navbar,
      Settings
    ])
  }
});
