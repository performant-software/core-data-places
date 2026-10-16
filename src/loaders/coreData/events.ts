import { createLoader } from '@loaders/coreData/helpers';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-events-loader', ['events', 'event']);

export default {
  events: defineCollection({ loader })
};
