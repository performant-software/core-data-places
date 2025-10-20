import { FuzzyDate as FuzzyDateUtils, ObjectJs as ObjectUtils } from '@performant-software/shared-components';
import { SearchConfig } from '@types';
import _ from 'underscore';

const INDEX_START_DATE = 0;
const INDEX_END_DATE = 1;

const MAP_ATTRIBUTES = [
  'id',
  'name',
  'names',
  'record_id',
  'type',
  'uuid'
];

const MAX_ATTRIBUTES = 4;

const SECOND_TO_MILLISECONDS = 1000;

/**
 * Returns the data for the map visualization.
 *
 * @param config
 * @param records
 */
export const buildMapData = (config: SearchConfig, records: any) => {
  const geometryAttribute = _.first(config.map.geometry.split('.'));
  const attributes = _.compact([...MAP_ATTRIBUTES, geometryAttribute]);

  const data = _.map(records, (record: any) => _.pick(record, ...attributes));

  return {
    data,
    name: config.name
  };
};

/**
 * Returns the data for the table visualization.
 *
 * @param config
 * @param records
 */
export const buildTableData = (config:SearchConfig, records: any) => {
  const columns = [
    config.result_card.title,
    ..._.pluck(config.result_card.attributes?.slice(0, MAX_ATTRIBUTES), 'name')
  ];

  const rows = _.map(records, (record: any) => {
    const row = {};

    _.each(columns, (column: string) => {
      row[column] = _.get(record, column.split('.'));
    });

    return row;
  });

  return {
    name: config.name,
    data: {
      columns,
      rows
    }
  };
};

/**
 * Returns the data for the timeline visualization.
 *
 * @param config
 * @param records
 */
export const buildTimelineData = (config: SearchConfig, records: any) => {
  const events = [];

  let min: number;
  let max: number;

  _.each(records, (record: any) => {
    let eventData = ObjectUtils.getNestedValue(record, config.timeline?.event_path);

    if (eventData && !_.isArray(eventData)) {
      eventData = [eventData];
    }

    _.each(eventData, (event: any) => {
      events.push(_.pick(event, 'name', 'start_date', 'end_date'));

      const startRange = getYearRange(event.start_date);
      const endRange = getYearRange(event.end_date);

      const minRange = Math.min(...[...startRange, ...endRange]);
      const maxRange = Math.max(...[...startRange, ...endRange]);

      if (!min || minRange < min) {
        min = minRange;
      }

      if (!max || maxRange > max) {
        max = maxRange;
      }
    });
  });

  return {
    name: config.name,
    events,
    min,
    max
  };
};

/**
 * Returns the data for the stacked timeline visualization
 * @param config
 * @param records
 */

export const buildStackedTimelineData = (config: SearchConfig, records: any) => {
  const events = [];

  _.each(records, (record: any) => {
    if (record.start_date && record.end_date) {
      events.push({
        name: record.name,
        date_range: [
          record.start_date[0],
          record.end_date[1]
        ],
        uuid: record.uuid
      })
    }
  });

  return {
    name: config.name,
    events: events?.sort((a,b) => (a.date_range[0] - b.date_range[0]))
  }
}

/**
 * Returns the year range for the passed start/end date array.
 *
 * @param dateArray
 */
const getYearRange = (dateArray: Array<number>) => {
  if (!dateArray) {
    return [];
  }

  return FuzzyDateUtils.getYearRange({
    start_date: dateArray[INDEX_START_DATE] * SECOND_TO_MILLISECONDS,
    end_date: dateArray[INDEX_END_DATE] * SECOND_TO_MILLISECONDS
  });
};