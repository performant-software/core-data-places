import SearchHighlight from '@apps/search/SearchHighlight';
import TranslationContext from '@apps/search/TranslationContext';
import useHoverable from '@apps/search/useHoverable';
import { SearchResultsTable, useCachedHits } from '@performant-software/core-data';
import { useNavigate, useRuntimeConfig } from '@peripleo/peripleo';
import clsx from 'clsx';
import { useCallback, useContext } from 'react';

interface Props {
  className?: string;
}

const TableView = (props: Props) => {
  const config = useRuntimeConfig<any>();
  const hits = useCachedHits();
  const { t } = useContext(TranslationContext);

  const { onPointEnter, onPointLeave } = useHoverable();
  const navigate = useNavigate();

  const { title } = config.search.result_card;

  /**
   * Navigates to the selected hit.
   */
  const onRowClick = useCallback((hit) => navigate(`${config.search.route}/${hit.id}`), []);

  return (
    <div
      className={clsx(
        'flex',
        'flex-col',
        'w-full',
        'p-2',
        'bg-white/80',
        'backdrop-blur',
        'shadow',
        'overflow-hidden',
        props.className
      )}
    >
      <SearchResultsTable
        columns={[{
          name: title,
          label: t(title),
          render: (hit) => (
            <SearchHighlight
              attribute={title}
              badge
              className='text-sm line-clamp-3 leading-6'
              hit={hit}
            />
          )
        }]}
        onRowClick={onRowClick}
        onRowPointerEnter={onPointEnter}
        onRowPointerLeave={onPointLeave}
        hits={hits}
      />
    </div>
  );
};

export default TableView;