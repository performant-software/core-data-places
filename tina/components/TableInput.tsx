import config from '@config';
import { ObjectJs as ObjectUtils } from '@performant-software/shared-components';
import { useCallback, useMemo } from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import _ from 'underscore';
import JsonUpload from './JsonUpload';

const MAX_COLUMNS = 4;

const TableInput = wrapFieldsWithMeta((props) => {
  /**
   * Memo-izes the array of table columns.
   */
  const columns = useMemo(() => [
    config.search.result_card.title,
    ..._.pluck(config.search.result_card.attributes?.splice(0, MAX_COLUMNS), 'name')
  ], [config]);

  /**
   * Converts the passed data to JSON and retains only the attributes needed to render the table.
   */
  const onChange = useCallback((data) => {
    const records = JSON.parse(data);

    const rows = _.map(records, (record) => {
      const r = {};

      _.each(columns, (column) => {
        r[column] = ObjectUtils.getNestedValue(record, column);
      });

      return r;
    });

    props.input.onChange(JSON.stringify({ columns, rows }));
  }, [columns]);

  return (
    <JsonUpload
      onChange={onChange}
      value={props.input.value}
    />
  );
});

export default TableInput;