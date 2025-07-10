import config from '@config';
import { buildTableData } from '@utils/visualization';
import { useCallback } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import _ from 'underscore';
import JsonUpload from './JsonUpload';

const TableInput = wrapFieldsWithMeta((props) => {
  /**
   * Converts the passed data to JSON and retains only the attributes needed to render the table.
   */
  const onChange = useCallback((data) => {
    const { name, data: records } = JSON.parse(data);
    const searchConfig = _.findWhere(config.search, { name });

    props.input.onChange(JSON.stringify(buildTableData(searchConfig, records)));
  }, []);

  return (
    <JsonUpload
      onChange={onChange}
      value={props.input.value}
    />
  );
});

export default TableInput;