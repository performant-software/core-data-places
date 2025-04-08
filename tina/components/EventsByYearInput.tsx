import config from '@config';
import { ObjectJs as ObjectUtils } from '@performant-software/shared-components';
import { Visualizations } from '@root/tina/content/visualizations';
import { useCallback, useState } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import _ from 'underscore';
import JsonUpload from './JsonUpload';

const EventsByYearInput = wrapFieldsWithMeta((props) => {
  const [error, setError] = useState<string | undefined>();

  /**
   * Returns the events for the passed record. If no path is present in the configuration, we'll assume the
   * base record is an event.
   *
   * @param record
   * @param options
   */
  const getEvents = useCallback((record, options) => {
    let events;

    if (options.path) {
      events = ObjectUtils.getNestedValue(record, options.path);
    } else {
      events = [record];
    }

    return events;
  }, []);

  /**
   * Fetches all of the events with the passed IDs.
   */
  const onChange = useCallback((data) => {
    const { name, data: records } = JSON.parse(data);

    const searchConfig = _.findWhere(config.search, { name });
    const options = _.findWhere(searchConfig.visualizations, { name: Visualizations.eventsByYear });

    if (options) {
      const events = _.chain(records)
        .map((records) => getEvents(records, options))
        .flatten()
        .compact()
        .value();

      // Create a map of years to counts of events. Also track the min and max year values.
      let min;
      let max;

      const result = {};

      _.each(events, (event) => {
        const start = Math.min(...(event.start_year || event.end_year));
        const end = Math.max(...(event.start_year || event.end_year));

        for (let i = start; i <= end; i += 1) {
          const count = result[`${i}`] || 0;
          result[`${i}`] = count + 1;
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
          count: result[`${i}`] || 0
        });
      }

      // Set the formatted data on the input
      props.input.onChange(JSON.stringify(formattedData));

    } else {
      setError('The uploaded dataset does not support the "Events By Year" visualizations.');
    }
  }, [getEvents]);

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