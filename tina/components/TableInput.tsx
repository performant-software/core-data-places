import config from '@config';
import { useCallback } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import _ from 'underscore';
import JsonUpload from './JsonUpload';

const MAX_ATTRIBUTES = 4;

const TableInput = wrapFieldsWithMeta((props) => {
  /**
   * Converts the passed data to JSON and retains only the attributes needed to render the table.
   */
  const onChange = useCallback((data) => {
    const { name, data: records } = JSON.parse(data);

    const searchConfig = _.findWhere(config.search, { name });

    const columns = [
      searchConfig.result_card.title,
      ..._.pluck(searchConfig.result_card.attributes?.slice(0, MAX_ATTRIBUTES), 'name')
    ];

    const rows = _.map(records, (record) => {
      const row = {};

      _.each(columns, (column) => {
        row[column] = _.get(record, column.split('.'));
      });

      return row;
    });

    props.input.onChange(JSON.stringify({ name, data: { columns, rows } }));
  }, []);

  return (
    <JsonUpload
      onChange={onChange}
      value={props.input.value}
    />
  );
});

export default TableInput;