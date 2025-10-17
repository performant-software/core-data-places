import config from '@config';
import EventsByYearInput from '@root/tina/components/EventsByYearInput';
import MapInput from '@root/tina/components/MapInput';
import TableInput from '@root/tina/components/TableInput';
import TimelineInput from '@root/tina/components/TimelineInput';
import { createDataVisualization } from '@root/tina/utils/content';
import { includeTimeline } from '@root/tina/utils/visualizations';
import _ from 'underscore';
import StackedTimelineInput from '../components/StackedTimelineInput';

export const Visualizations = {
  eventsByYear: 'events_by_year'
};

// All projects can embed table and map visualizations by default, as they require no configuration.
const schema = [
  createDataVisualization({
    name: 'data_table',
    label: 'Table',
    component: TableInput
  }),
  createDataVisualization({
    name: 'map',
    label: 'Map',
    component: MapInput
  })
];

// Add "timeline" visualization if the site includes a timeline
const includeTimelineVisualization = _.some(config.search, (search) => includeTimeline(search));
if (includeTimelineVisualization) {
  schema.push(createDataVisualization({
    name: 'timeline',
    label: 'Timeline',
    component: TimelineInput
  }));
}

// Add "events_by_year" visualization if configured
const includeEventsByYear = _.some(config.search, (search) => (
  !!_.findWhere(search.visualizations, { name: Visualizations.eventsByYear })
));

if (includeEventsByYear) {
  schema.push(createDataVisualization({
    name: 'events_by_year',
    label: 'Events By Year',
    component: EventsByYearInput,
    fields: [{
      name: 'interval',
      label: 'Interval',
      type: 'number'
    }]
  }));
}

// Add "stacked_timeline" if an Events model is configured for search
const includeStackedTimeline = _.some(config.search, (search) => search.name === 'events');

if (includeStackedTimeline) {
  schema.push(createDataVisualization({
    name: 'stacked_timeline',
    label: 'Stacked Timeline',
    component: StackedTimelineInput
  }))
}

export default schema;