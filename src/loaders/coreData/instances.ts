import { createLoader } from '@loaders/coreData/helpers';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-instances-loader', ['instances', 'instance']);

export default {
  instances: defineCollection({ loader })
};