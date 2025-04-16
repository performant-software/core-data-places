import { createLoader } from '@loaders/coreData/helpers';
import { MediaContentsService } from '@performant-software/core-data/ssr';
import { defineCollection } from 'astro:content';

const loader = createLoader('core-data-organizations-loader', MediaContentsService, ['media_contents', 'media_content']);

export default {
  mediaContents: defineCollection({ loader })
};
