import config from '@config';
import { FuzzyDate as FuzzyDateUtils, ObjectJs as ObjectUtils } from '@performant-software/shared-components';
import { includeTimeline } from '@root/tina/utils/visualizations';
import { buildTimelineData } from '@utils/visualization';
import { useCallback, useState } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import _ from 'underscore';
import JsonUpload from './JsonUpload';

const TimelineInput = wrapFieldsWithMeta((props) => {
  const [error, setError] = useState<string | undefined>();

  /**
   * Removes all of the extraneous data from the uploaded JSON.
   */
  const onChange = useCallback((data) => {
    if (!data) {
      props.input.onChange(null);
      return;
    }
    const { name, data: records } = JSON.parse(data);
    const searchConfig = _.findWhere(config.search, { name });

    if (includeTimeline(searchConfig)) {
      props.input.onChange(JSON.stringify(buildTimelineData(searchConfig, records)));
    } else {
      setError('The uploaded dataset does not support the "Timeline" visualization.');
    }
  }, []);

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