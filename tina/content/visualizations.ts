import config from '@config';
import EventsByYearInput from '@root/tina/components/EventsByYearInput';
import MapInput from '@root/tina/components/MapInput';
import TableInput from '@root/tina/components/TableInput';
import { createDataVisualization } from '@root/tina/utils/content';
import _ from 'underscore';

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

export default schema;