import _ from 'underscore';

/**
 * Returns true if the `<timeline>` post embed is available for the passed search
 * configuration. The embed needs `timeline.event_path` because
 * `buildTimelineData` extracts events via `getNestedValue(hit, event_path)`;
 * without it, the build returns zero events.
 *
 * This is distinct from the search-UI timeline view (the "Timeline" toggle on
 * the search page), which is gated on `timeline.date_range_facet` in
 * `Header.tsx` / `TimelineView.tsx`. A search can enable that filter without
 * also enabling the post embed.
 */
export const includeTimeline = (config) => !_.isEmpty(config?.timeline?.event_path);