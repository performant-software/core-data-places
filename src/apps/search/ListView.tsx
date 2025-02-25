import SearchHighlight from '@apps/search/SearchHighlight';
import useHoverable from '@apps/search/useHoverable';
import { SearchList, useCachedHits } from '@performant-software/core-data';
import { useNavigate, useRuntimeConfig } from '@peripleo/peripleo';
import { renderFlattenedAttribute } from '@root/src/utils/search';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import _ from 'underscore';

interface Props {
  className?: string;
}

const ListView = (props: Props) => {
  const config = useRuntimeConfig();
  const hits = useCachedHits();
  const navigate = useNavigate();

  const { isHover, onPointEnter, onPointLeave } = useHoverable();

  /**
   * Navigates to the selected hit.
   */
  const onRowClick = useCallback((hit) => {
    navigate(`${config.search.route}/${hit.id}`);
  }, []);

  /**
   * List of attributes to display in the search list
   */
  const attributes = useMemo(() => {
    if (config.search.result_card.attributes) {
      return config.search.result_card.attributes
        .slice(0, 4)
        .map(att => ({
          render: (hit) => renderFlattenedAttribute(hit, att.name),
          ...att
        }));
    };

    return []
  }, [config]);

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
        attributes={attributes}
        className='flex flex-col'
        isHighlight={isHover}
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
