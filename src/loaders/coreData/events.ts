import { createLoader } from '@loaders/coreData/helpers';
import { EventsService } from '@performant-software/core-data/ssr';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-events-loader', EventsService, ['events', 'event']);

export default {
  events: defineCollection({ loader })
};
