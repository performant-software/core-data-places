import config from '@config';
import { buildStackedTimelineData } from '@utils/visualization';
import { useCallback, useState } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import _ from 'underscore';
import JsonUpload from './JsonUpload';

const StackedTimelineInput = wrapFieldsWithMeta((props) => {
  const [error, setError] = useState<string | undefined>();

  /**
   * Removes all of the extraneous data from the uploaded JSON.
   */
  const onChange = useCallback((data) => {
    const { name, data: records } = JSON.parse(data);
    const searchConfig = _.findWhere(config.search, { name });

    if (_.find(records, (record) => record?.start_date)) {
      props.input.onChange(JSON.stringify(buildStackedTimelineData(searchConfig, records)));
    } else {
      setError('Only Event models support the "Stacked Timeline" visualization.');
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

export default StackedTimelineInput;