import { createLoader } from '@loaders/coreData/helpers';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-places-loader', ['places', 'place']);

export default {
  places: defineCollection({ loader })
};