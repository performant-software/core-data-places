import VisualizationContainer from '@components/VisualizationContainer';
import TranslationContext from '@contexts/TranslationContext';
import { SearchResultsTable } from '@performant-software/core-data';
import type { DataVisualizationProps } from '@types';
import { useContext, useMemo } from 'react';
import _ from 'underscore';

const Table = (props: DataVisualizationProps) => {
  const { t } = useContext(TranslationContext);

  /**
   * Memo-izes the data as JSON.
   */
  const data = useMemo(() => JSON.parse(props.data), [props.data]);

  /**
   * Memo-izes the table columns and labels.
   */
  const columns = useMemo(() => _.map(data.columns, (column) => ({
    name: column,
    label: t(column)
  })), [data, t]);

  return (
    <VisualizationContainer
      title={props.title}
    >
      <div
        className='bg-white not-prose p-3'
      >
        <SearchResultsTable
          columns={columns}
          hits={data.rows}
        />
      </div>
    </VisualizationContainer>
  );
};

export default Table;