import config from '@config';
import { useCallback } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import JsonUpload from './JsonUpload';
import _ from 'underscore';

const ATTRIBUTES = [
  'id',
  'name',
  'names',
  'record_id',
  'type',
  'uuid'
];

const MapInput = wrapFieldsWithMeta((props) => {
  /**
   * Removes all of the extraneous data from the uploaded JSON.
   */
  const onChange = useCallback((data) => {
    const { name, data: records } = JSON.parse(data);
    const searchConfig = _.findWhere(config.search, { name });

    const attributes = _.compact([...ATTRIBUTES, searchConfig.map.geometry || undefined]);
    const value = _.map(records, (record) => _.pick(record, ...attributes));

    props.input.onChange(JSON.stringify({ name, data: value }));
  }, []);

  return (
    <JsonUpload
      onChange={onChange}
      value={props.input.value}
    />
  );
});

export default MapInput;