import { LoaderContext } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { getManifests } from '@utils/galleries';

const loader = {
  name: 'gallery-loader',
  load: async (context: LoaderContext): Promise<void> => {
    const { logger, store } = context;

    logger.info('Fetching gallery manifests.');

    const data = await getManifests();

    for (const item of data) {
      store.set({ id: item.id, data: item });
    }
  }
}

export default {
  galleries: defineCollection({ loader })
};
