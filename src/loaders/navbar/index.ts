import { fetchNavbars } from '@backend/tina';
import type { LoaderContext } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import _ from 'underscore';

const loader = {
  name: 'navbar-loader',
  load: async (context: LoaderContext): Promise<void> => {
    const { generateDigest, logger, parseData, store } = context;

    logger.info('Fetching data.');

    const response = await fetchNavbars();

    for (const item of response) {
      const { filename: id } = item._sys;

      const data = await parseData({ id, data: item });
      const digest = generateDigest(data);

      store.set({ id, data, digest });
    }
  }
};

export default {
  navbar: defineCollection({ loader })
};