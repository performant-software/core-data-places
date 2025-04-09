import config from '@config';
import { FuzzyDate as FuzzyDateUtils, ObjectJs as ObjectUtils } from '@performant-software/shared-components';
import { includeTimeline } from '@root/tina/utils/visualizations';
import { useCallback, useState } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import _ from 'underscore';
import JsonUpload from './JsonUpload';

const INDEX_START_DATE = 0;
const INDEX_END_DATE = 1;

const SECOND_TO_MILLISECONDS = 1000;

const TimelineInput = wrapFieldsWithMeta((props) => {
  const [error, setError] = useState<string | undefined>();

  /**
   * Returns the year range for the passed date array.
   */
  const getYearRange = useCallback((dateArray) => {
    if (!dateArray) {
      return [];
    }

    return FuzzyDateUtils.getYearRange({
      start_date: dateArray[INDEX_START_DATE] * SECOND_TO_MILLISECONDS,
      end_date: dateArray[INDEX_END_DATE] * SECOND_TO_MILLISECONDS
    });
}, []);

  /**
   * Sets the passed records as the input value.
   */
  const setInputValue = useCallback((records, searchConfig) => {
    const events = [];

    let min;
    let max;

    _.each(records, (record) => {
      let eventData = ObjectUtils.getNestedValue(record, searchConfig.timeline?.event_path);

      if (eventData && !_.isArray(eventData)) {
        eventData = [eventData];
      }

      _.each(eventData, (event) => {
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

    props.input.onChange(JSON.stringify({ name, events, min, max }));
  }, [getYearRange]);

  /**
   * Removes all of the extraneous data from the uploaded JSON.
   */
  const onChange = useCallback((data) => {
    const { name, data: records } = JSON.parse(data);
    const searchConfig = _.findWhere(config.search, { name });

    if (includeTimeline(searchConfig)) {
      setInputValue(records, searchConfig);
    } else {
      setError('The uploaded dataset does not support the "Timeline" visualization.');
    }
  }, [setInputValue]);

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

export default TimelineInput;