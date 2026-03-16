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

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';
const localContentPath = process.env.TINA_LOCAL_CONTENT_PATH;
const useSSO = process.env.TINA_PUBLIC_AUTH_USE_KEYCLOAK === 'true';
const useClerk = process.env.TINA_PUBLIC_AUTH_USE_CLERK === 'true';

const getAuthProvider = async () => {
  if (isLocal) return new LocalAuthProvider();

  if (useClerk) {
    const { default: Clerk } = await import('@clerk/clerk-js');
    const { ClerkAuthProvider } = await import('tinacms-clerk/dist/tinacms');
    const clerkInstance = new Clerk(process.env.TINA_PUBLIC_CLERK_PUBLISHABLE_KEY!);
    await clerkInstance.load();
    return new ClerkAuthProvider({ clerk: clerkInstance });
  }

  if (useSSO) return new CustomAuthProvider();

  return new UsernamePasswordAuthJSProvider();
};

export default defineConfig({
  authProvider: await getAuthProvider(),
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  cmsCallback: (cms) => {
    import('./role-ui').then(({ applyEditorRestrictions }) => {
      applyEditorRestrictions(cms);
    });

    const { default: PublishedToggle } = require('./components/PublishedToggle');
    const { default: ReadOnlyText } = require('./components/ReadOnlyText');
    cms.fields.add({ name: 'PublishedToggle', Component: PublishedToggle });
    cms.fields.add({ name: 'ReadOnlyText', Component: ReadOnlyText });

    return cms;
  },
  contentApiUrlOverride: '/api/tina/gql',
  localContentPath,
  media: {
    loadCustomStore: async () => {
      const pack = await import('next-tinacms-s3');
      return pack.TinaCloudS3MediaStore;
    }
  },
  schema: {
    collections: _.compact([
      !useSSO && !useClerk
        ? TinaUserCollection
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
