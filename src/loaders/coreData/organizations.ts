import { createLoader } from '@loaders/coreData/helpers';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-organizations-loader', ['organizations', 'organization']);

export default {
  organizations: defineCollection({ loader })
};