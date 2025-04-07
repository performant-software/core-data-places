import { fetchI18ns } from '@backend/tina';
import { TRANSLATION_PREFIX } from '@i18n/utils';
import type { LoaderContext } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import _ from 'underscore';

const loader = {
  name: 'i18n-loader',
  load: async (context: LoaderContext): Promise<void> => {
    const { generateDigest, parseData, store } = context;
    const response = await fetchI18ns();

    for (const item of response) {
      const { filename: id } = item._sys;
      const keys = _.filter(_.keys(item), (key) => key.startsWith(TRANSLATION_PREFIX));

      const data = await parseData({ id, data: _.pick(item, keys) });
      const digest = generateDigest(data);

      store.set({ id, data, digest });
    }
  }
};

export default {
  i18n: defineCollection({ loader })
};