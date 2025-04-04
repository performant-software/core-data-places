import { createLoader } from '@loaders/coreData/helpers';
import { PlacesService } from '@performant-software/core-data/ssr';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-places-loader', PlacesService, ['places', 'place']);

export default {
  places: defineCollection({ loader })
};