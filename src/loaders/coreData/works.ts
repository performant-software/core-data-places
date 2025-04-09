import { createLoader } from '@loaders/coreData/helpers';
import { WorksService } from '@performant-software/core-data/ssr';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-works-loader', WorksService, ['works', 'work']);

export default {
  works: defineCollection({ loader })
};