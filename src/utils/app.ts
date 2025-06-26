/**
 * Returns `true` if the site is built in "static" mode.
 */
export const isStaticBuild = import.meta.env.STATIC_BUILD === 'true';

/**
 * Returns `true` if the content should be loaded from the content cache. If `false`, data will be fetched
 * using the data loaders.
 */
export const useContentCache = import.meta.env.USE_CONTENT_CACHE === 'true';