import config from '@config';
import { buildMapData } from '@utils/visualization';
import { useCallback } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import JsonUpload from './JsonUpload';
import _ from 'underscore';

const MapInput = wrapFieldsWithMeta((props) => {
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

    props.input.onChange(JSON.stringify(buildMapData(searchConfig, records)));
  }, []);

  return (
    <JsonUpload
      onChange={onChange}
      value={props.input.value}
    />
  );
});

export default MapInput;