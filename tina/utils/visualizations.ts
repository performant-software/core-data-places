import _ from 'underscore';

/**
 * Returns true if the timeline embed is available for the passed search configuration.
 *
 * @param config
 */
export const includeTimeline = (config) => !_.isEmpty(config.timeline);