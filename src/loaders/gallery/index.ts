import { LoaderContext } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { getManifests, getStaticManifestUrl } from '@utils/galleries';

const loader = {
  name: 'gallery-loader',
  load: async (context: LoaderContext): Promise<void> => {
    const { logger, store } = context;

    logger.info('Fetching gallery manifests.');

    const data = await getManifests();

    for (const item of data) {
      const manifest = {
        ...item,
        id: getStaticManifestUrl(item.id)
      }

      store.set({ id: item.id, data: manifest });
    }
  }
}

export default {
  galleries: defineCollection({ loader })
};
