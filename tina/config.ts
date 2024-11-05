import { defineConfig, LocalAuthProvider } from 'tinacms';
import { TinaUserCollection, UsernamePasswordAuthJSProvider } from 'tinacms-authjs/dist/tinacms';
import _ from 'underscore';
import config from '../public/config.json';
import About from './content/about';
import I18n from './content/i18n';
import PathsCollection from './content/paths';
import PostsCollection from './content/posts';
import Settings from './content/settings';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';
const localContentPath = process.env.TINA_LOCAL_CONTENT_PATH;

export default defineConfig({
  authProvider: isLocal
    ? new LocalAuthProvider()
    : new UsernamePasswordAuthJSProvider(),
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
      TinaUserCollection,
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
