import SearchHighlight from '@apps/search/SearchHighlight';
import useHoverable from '@apps/search/useHoverable';
import { SearchList, useCachedHits } from '@performant-software/core-data';
import { useNavigate, useRuntimeConfig } from '@peripleo/peripleo';
import clsx from 'clsx';
import { useCallback } from 'react';

interface Props {
  className?: string;
}

const ListView = (props: Props) => {
  const config = useRuntimeConfig();
  const hits = useCachedHits();
  const navigate = useNavigate();

  const { onPointEnter, onPointLeave } = useHoverable();

  /**
   * Navigates to the selected hit.
   */
  const onRowClick = useCallback((hit) => {
    navigate(`${config.search.route}/${hit.id}`);
  }, []);

  return (
    <aside
      className={clsx(
        'flex',
        'flex-col',
        'h-full',
        'bg-white/80',
        'backdrop-blur',
        'shadow',
        props.className
      )}
    >
      <SearchList
        className='flex flex-col'
        items={hits}
        itemTitle={(hit) => (
          <SearchHighlight
            attribute={config.search.result_card.title}
            badge
            className='text-sm line-clamp-3 leading-6'
            hit={hit}
          />
        )}
        onItemClick={onRowClick}
        onItemPointerEnter={onPointEnter}
        onItemPointerLeave={onPointLeave}
      />
    </aside>
  );
};

export default ListView;
