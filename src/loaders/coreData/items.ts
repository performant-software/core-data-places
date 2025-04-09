import { createLoader } from '@loaders/coreData/helpers';
import { ItemsService } from '@performant-software/core-data/ssr';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-items-loader', ItemsService, ['items', 'item']);

export default {
  items: defineCollection({ loader })
};