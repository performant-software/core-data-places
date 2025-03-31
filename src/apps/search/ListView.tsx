import { useSearchConfig } from '@apps/search/SearchContext';
import SearchHighlight from '@apps/search/SearchHighlight';
import useHoverable from '@apps/search/useHoverable';
import useSelectable from '@apps/search/useSelectable';
import { SearchList, useCachedHits } from '@performant-software/core-data';
import { useNavigate } from '@peripleo/peripleo';
import { getAttributes, getHitValue } from '@utils/search';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import _ from 'underscore';

interface Props {
  className?: string;
}

const ListView = (props: Props) => {
  const config = useSearchConfig();
  const hits = useCachedHits();
  const navigate = useNavigate();

  const { isHover, onPointEnter, onPointLeave } = useHoverable();
  const { isSelected } = useSelectable();

  /**
   * List of attributes to display in the search list
   */
  const attributes = useMemo(() => _.map(getAttributes(config), (attr) => ({
    render: (hit) => getHitValue(hit, attr.name),
    ...attr
  })), [config]);

  /**
   * Navigates to the selected hit.
   */
  const onRowClick = useCallback((hit) => {
    navigate(`${config.route}/${hit.id}`);
  }, []);

  /**
   * Renders the title for the passed item.
   */
  const renderItemTitle = useCallback((item) => (
    <SearchHighlight
      attribute={config.result_card.title}
      classNames={{
        highlight: 'text-sm line-clamp-3 leading-6'
      }}
      hit={item}
    />
  ), [config]);

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
        isHighlight={(item) => isHover(item) || isSelected(item)}
        items={hits}
        itemTitle={renderItemTitle}
        onItemClick={onRowClick}
        onItemPointerEnter={onPointEnter}
        onItemPointerLeave={onPointLeave}
      />
    </aside>
  );
};

export default ListView;
