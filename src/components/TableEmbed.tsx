import TranslationContext from '@root/src/contexts/TranslationContext';
import { SearchResultsTable } from '@performant-software/core-data';
import { useRuntimeConfig } from '@peripleo/peripleo';
import { useContext, useMemo } from 'react';

const TableEmbed = (props) => {
  const config = useRuntimeConfig<any>();
  const { t } = useContext(TranslationContext);

  const hits = useMemo(() => JSON.parse(props.data), [props.data]);

  return (
    <div>
      <h3>
        { props.title }
      </h3>
      <div
        className='bg-white not-prose p-3'
      >
        <SearchResultsTable
          columns={[{
            name: config.search.result_card.title,
            label: t(config.search.result_card.title)
          }]}
          hits={hits}
        />
      </div>
    </div>
  );
};

export default TableEmbed;