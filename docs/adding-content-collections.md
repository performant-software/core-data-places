# Adding a New Tina Collection

Developers should use the following steps to add a new type of content to the TinaCMS schema. The steps differ based on whether the new collection should be accessible to editors or only to site admins.

## Common Steps
1. Create a file `newCollectionName.ts` in `tina/content` (e.g. `stories.ts`).
2. In your new file, define your `Collection` following this example (obviously replacing `stories` with your new collection name):
```
import { Collection } from '@tinacms/schema-tools';
import { commonCollectionFields } from './common';
import { logEditHistory } from '../utils/content';

const Stories: Collection = {
  name: 'stories',
  label: 'Stories',
  path: 'content/stories',
  format: 'json',
  ui: {
    beforeSubmit: async (arg: { values, form, cms }) => {
      return await logEditHistory(arg, "stories");
    },
  },
  fields: [
    // Add your fields here
    ...commonCollectionFields
  ]
};

export default Stories;
```
3. Import your new collection to `tina/config.ts` and add it to the `schema` array of the config.

## Admin-Only Collections
If the new collection should only be accessible by TinaCMS admin users, then...
4. In `tina/role-ui.ts`, add the *label* of your collection to the `ADMIN_ONLY_COLLECTIONS` constant.

## Editor-created Content Collections
If the new collection should be editable by all project members, then...
5. In `netlify/functions/tina.ts`, add your new collection name to the `MEMBER_COLLECTIONS` constant.
6. Make sure that your collection schema includes all of the elements in the example below. Specifically, you should add...
- A `_notEditableNotice` field using the `NotEditableNotice` component (displays when a member accesses a document they don't have edit access to);
- A `creator` field using the `Creator` (read-only) component;
- A `published` field using the `PublishToggle` component (disabled for non-admins);
- A check in `beforeSubmit` to prevent editing of content the user didn't create;
- A method in `beforeSubmit` to add the `creator` value when the document is first saved.
```  
import { Collection } from '@tinacms/schema-tools';
import { commonCollectionFields } from './common';
import { logEditHistory } from '../utils/content';
import Creator from '../components/Creator';
import NotEditableNotice from '../components/NotEditableNotice';
import PublishToggle from '../components/PublishToggle';
import { getUserRole } from '../utils/getUserRole';

const Stories: Collection = {
  name: 'stories',
  label: 'Stories',
  path: 'content/stories',
  format: 'json',
  ui: {
    beforeSubmit: async (arg: { values, form, cms }) => {
      const { isAdmin, userId } = getUserRole(arg.cms);

      // Block saves for non-owners
      if (!isAdmin && arg.values.creator?.id && arg.values.creator.id !== userId) {
        throw new Error('You can only edit content you created.');
      }

      // Auto-populate creator on first save
      const user = arg.cms?.api?.tina?.authProvider?.clerk?.user;
      if (!arg.values.creator && user) {
        arg.values.creator = {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress
        };
      }

      return await logEditHistory(arg, "stories");
    }
  },
  fields: [
    {
      name: '_notEditableNotice',
      type: 'string',
      ui: {
        component: NotEditableNotice
      }
    },
    {
      type: 'object',
      name: 'creator',
      label: 'Creator',
      fields: [{
        name: 'id',
        label: 'ID',
        type: 'string'
      }, {
        name: 'email',
        label: 'Email',
        type: 'string'
      }],
      ui: {
        component: Creator
      }
    },
    {
      name: 'published',
      label: 'Published',
      type: 'boolean',
      ui: {
        component: PublishToggle
      }
    },
    // Add your fields here
    ...commonCollectionFields
  ]
}
```

## Using Your Collection
Chances are if you made this collection you intend to use content from it somewhere, so you should probably...
7. Add methods to fetch content from your new collection in `src/backend/tina/index.ts`, following the format of the other functions in that file.

## Visual Editing
If you want your collection hooked up to the Tina visual editor, there are a couple further steps.
8. Add the `ui.router` property to your collection pointing to the URL of the page you want the visual editor to render, e.g.
```
...
  ui: {
    router: ({ document }) => {      
      return `/en/stories/preview/${document._sys.filename}`;
    },
    ...
  }
...
```
9. Register your collection in the Tina islands registry found in `src/lib/islands.ts`, specifying how to fetch the collection data, what component to render, where on the page to render it (e.g. inside `main`), and what props to pass to it.
10. On the page that will display in the visual editor, wrap the content in the `TinaIsland` component, e.g.
```  
<TinaIsland name="story" wrapper={islands.story.wrapper} params={{ lang, slug }} primary>
  <Story/>
</TinaIsland>
```
If desired, you can use the `data-tina-field={tinaField(story, 'field_name')}` attribute on native HTML elements inside your Astro components for deeper routing.
