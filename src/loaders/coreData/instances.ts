import { createLoader } from '@loaders/coreData/helpers';
import { InstancesService } from '@performant-software/core-data/ssr';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-instances-loader', InstancesService, ['instances', 'instance']);

export default {
  instances: defineCollection({ loader })
};