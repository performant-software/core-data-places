import { createLoader } from '@loaders/coreData/helpers';
import { PeopleService } from '@performant-software/core-data/ssr';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-people-loader', PeopleService, ['people', 'person']);

export default {
  people: defineCollection({ loader })
};
