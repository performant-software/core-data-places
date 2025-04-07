import config from '@config';
import { FuzzyDate as FuzzyDateUtils, ObjectJs as ObjectUtils } from '@performant-software/shared-components';
import { useCallback } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import _ from 'underscore';
import JsonUpload from './JsonUpload';

const INDEX_START_DATE = 0;
const INDEX_END_DATE = 1;

const SECOND_TO_MILLISECONDS = 1000;

const TimelineInput = wrapFieldsWithMeta((props) => {
  /**
   * Returns the year range for the passed date array.
   */
  const getYearRange = useCallback((dateArray) => (
    FuzzyDateUtils.getYearRange({
      start_date: dateArray[INDEX_START_DATE] * SECOND_TO_MILLISECONDS,
      end_date: dateArray[INDEX_END_DATE] * SECOND_TO_MILLISECONDS
    })
  ), []);

  /**
   * Removes all of the extraneous data from the uploaded JSON.
   */
  const onChange = useCallback((data) => {
    const { name, data: records } = JSON.parse(data);
    const searchConfig = _.findWhere(config.search, { name });

    const events = [];

    let min;
    let max;

    _.each(records, (record) => {
      const eventData = ObjectUtils.getNestedValue(record, searchConfig.timeline.event_path || '');

      _.each(eventData, (event) => {
        events.push(event);

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

    props.input.onChange(JSON.stringify({ name, events, min, max }));
  }, [getYearRange]);

  return (
    <JsonUpload
      onChange={onChange}
      value={props.input.value}
    />
  );
});

export default TimelineInput;