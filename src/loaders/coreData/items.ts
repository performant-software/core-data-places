import { createLoader } from '@loaders/coreData/helpers';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-items-loader', ['items', 'item']);

export default {
  items: defineCollection({ loader })
};