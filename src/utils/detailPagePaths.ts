import config from '@config' with { type: 'json' };
import { Models } from '@types';

/**
 * Returns true if the current configuration includes detail pages for the passed model.
 * @param model
 */
export const hasDetailPage = (model: Models) => {
  return config.detail_pages?.models && Object.keys(config.detail_pages.models).includes(model);
}
