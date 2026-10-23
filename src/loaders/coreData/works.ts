import { createLoader } from '@loaders/coreData/helpers';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-works-loader', ['works', 'work']);

export default {
  works: defineCollection({ loader })
};