import config from '@config';
import { useCallback, useMemo } from 'react';
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
   * Memo-izes the "geometry" attribute.
   */
  const geometry = useMemo(() => _.first(config.map.geometry.split('.')), []);

  /**
   * Memo-izes the list of attributes to save.
   */
  const attributes = useMemo(() => _.compact([...ATTRIBUTES, geometry || undefined]), [geometry]);

  /**
   * Removes all of the extraneous data from the uploaded JSON.
   */
  const onChange = useCallback((data) => {
    const records = JSON.parse(data);

    const value = _.map(records, (record) => _.pick(record, ...attributes));

    props.input.onChange(JSON.stringify(value));
  }, [attributes]);

  return (
    <JsonUpload
      onChange={onChange}
      value={props.input.value}
    />
  );
});

export default MapInput;