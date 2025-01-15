import { Collection, defineConfig, LocalAuthProvider } from 'tinacms';
import _ from 'underscore';
import config from '../public/config.json';
import About from './content/about';
import I18n from './content/i18n';
import PathsCollection from './content/paths';
import PostsCollection from './content/posts';
import Settings from './content/settings';
import { CustomAuthProvider } from './auth-provider';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';
const localContentPath = process.env.TINA_LOCAL_CONTENT_PATH;

export default defineConfig({
  authProvider: isLocal
    ? new LocalAuthProvider()
    : new CustomAuthProvider(),
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
      // {
      //   ...TinaUserCollection,
      //   fields: [
      //     {
      //       ...TinaUserCollection.fields[0],
      //       fields: [
      //         {
      //           type: 'string',
      //           label: 'Username',
      //           name: 'username',
      //           uid: true,
      //           required: true,
      //         },
      //         {
      //           type: 'string',
      //           label: 'Name',
      //           name: 'name',
      //         },
      //         {
      //           type: 'string',
      //           label: 'Email',
      //           name: 'email',
      //         },
      //       ],
      //     },
      //   ],
      // } as Collection,
      About,
      Settings,
      config.content?.includes('paths')
        ? PathsCollection
        : undefined,
      config.content?.includes('posts')
        ? PostsCollection
        : undefined,
      I18n
    ])
  }
});
