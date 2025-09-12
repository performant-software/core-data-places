import { Configuration } from '@types';
import _ from 'underscore';

const CONTENT_PATHS = 'paths';
const CONTENT_POSTS = 'posts';

/**
 * Returns true if the passed configuration contains the passed content type.
 *
 * @param config
 * @param contentType
 */
const hasContent = (config: Configuration, contentType: string) => _.contains(config.content?.collections, contentType);

/**
 * Returns true if the passed configuration includes paths content.
 *
 * @param config
 */
export const hasPathsContent = (config: Configuration) => hasContent(config, CONTENT_PATHS);

/**
 * Returns true if the passed configuration contains posts content.
 *
 * @param config
 */
export const hasPostsContent = (config: Configuration) => hasContent(config, CONTENT_POSTS);