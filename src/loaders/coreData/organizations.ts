import { createLoader } from '@loaders/coreData/helpers';
import { OrganizationsService } from '@performant-software/core-data/ssr';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-organizations-loader', OrganizationsService, ['organizations', 'organization']);

export default {
  organizations: defineCollection({ loader })
};