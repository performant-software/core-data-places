import EventsService from '@backend/api/events';
import config from '@config';
import { FuzzyDate as FuzzyDateUtils, ObjectJs as ObjectUtils } from '@performant-software/shared-components';
import { Visualizations } from '@root/tina/content/visualizations';
import { useCallback, useState } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import _ from 'underscore';
import JsonUpload from './JsonUpload';

const EventsByYearInput = wrapFieldsWithMeta((props) => {
  const [error, setError] = useState<string | undefined>();

  /**
   * Returns the event IDs for the passed record. If no path is present in the configuration, we'll assume the
   * base record is an event.
   *
   * @param record
   * @param options
   */
  const getEventIds = useCallback((record, options) => {
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
      const startRange = (event.start_date && FuzzyDateUtils.getYearRange(event.start_date)) || [];
      const endRange = (event.end_date && FuzzyDateUtils.getYearRange(event.end_date)) || [];

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
    const { name, data: records } = JSON.parse(data);

    const searchConfig = _.findWhere(config.search, { name });
    const options = _.findWhere(searchConfig.visualizations, { name: Visualizations.eventsByYear });

    if (options) {
      const eventIds = _.chain(records)
        .map((records) => getEventIds(records, options))
        .flatten()
        .compact()
        .value();

      EventsService
        .fetchAll({ id: eventIds })
        .then(onLoad);
    } else {
      setError('The uploaded dataset does not support the "Events By Year" visualizations.');
    }
  }, [getEventIds, onLoad]);

  return (
    <>
      { error && (
        <div
          className='text-lg'
        >
          { error }
        </div>
      )}
      <JsonUpload
        onChange={onChange}
        value={props.input.value}
      />
    </>

  );
});

export default EventsByYearInput;