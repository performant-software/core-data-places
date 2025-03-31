import EventsService from '@backend/api/coreData/events';
import config from '@config';
import { FuzzyDate as FuzzyDateUtils, ObjectJs as ObjectUtils } from '@performant-software/shared-components';
import { useCallback } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import _ from 'underscore';
import JsonUpload from './JsonUpload';

const EventsByYearInput = wrapFieldsWithMeta((props) => {
  const options = config.visualizations?.events_by_year || {};

  /**
   * Returns the event IDs for the passed record. If no path is present in the configuration, we'll assume the
   * base record is an event.
   */
  const getEventIds = useCallback((record) => {
    let ids;

    if (options.path) {
      const events = ObjectUtils.getNestedValue(record, options.path);
      ids = _.pluck(events, 'uuid');
    } else {
      ids = [record.uuid];
    }

    return ids;
  }, []);

  /**
   * Formats the data for the passed set of events. The array will contain a list of objects
   * with "year" and "count" properties.
   */
  const onLoad = useCallback((events) => {
    const data = {};

    // Create a map of years to counts of events. Also track the min and max year values.
    let min;
    let max;

    _.each(events, (event) => {
      const startRange = FuzzyDateUtils.getYearRange(event.start_date);
      const endRange = FuzzyDateUtils.getYearRange(event.end_date);

      const start = Math.min(...[...startRange, ...endRange]);
      const end = Math.max(...[...startRange, ...endRange]);

      for (let i = start; i <= end; i += 1) {
        const count = data[`${i}`] || 0;
        data[`${i}`] = count + 1;
      }

      if (!min || start < min) {
        min = start;
      }

      if (!max || end > max) {
        max = end;
      }
    });

    // Format the data as an array of objects with "year" and "count" properties.
    const formattedData = [];

    for (let i = min; i <= max; i += 1) {
      formattedData.push({
        year: i,
        count: data[`${i}`] || 0
      });
    }

    // Set the formatted data on the input
    props.input.onChange(JSON.stringify(formattedData));
  }, []);

  /**
   * Fetches all of the events with the passed IDs.
   */
  const onChange = useCallback((data) => {
    const records = JSON.parse(data);

    const eventIds = _.chain(records)
      .map(getEventIds)
      .flatten()
      .compact()
      .value();

    EventsService
      .fetchAll({ id: eventIds })
      .then(onLoad);
  }, [getEventIds, onLoad]);

  return (
    <JsonUpload
      onChange={onChange}
      value={props.input.value}
    />
  );
});

export default EventsByYearInput;