import { createLoader } from '@loaders/coreData/helpers';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-people-loader', ['people', 'person']);

export default {
  people: defineCollection({ loader })
};
