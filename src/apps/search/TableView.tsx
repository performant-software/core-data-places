import { useSearchConfig } from '@apps/search/SearchContext';
import SearchHighlight from '@apps/search/SearchHighlight';
import TranslationContext from '@apps/search/TranslationContext';
import useHoverable from '@apps/search/useHoverable';
import useSelectable from '@apps/search/useSelectable';
import { SearchResultsTable, useCachedHits } from '@performant-software/core-data';
import { useNavigate, useRuntimeConfig } from '@peripleo/peripleo';
import { getColumnLabel, renderFlattenedAttribute } from '@root/src/utils/search';
import clsx from 'clsx';
import { useCallback, useContext, useMemo } from 'react';

interface Props {
  className?: string;
}

const TableView = (props: Props) => {
  const config = useSearchConfig();
  const hits = useCachedHits();
  const navigate = useNavigate();
  const { t } = useContext(TranslationContext);

  const { isHover, onPointEnter, onPointLeave } = useHoverable();
  const { isSelected } = useSelectable();

  const { title } = config.result_card;

  /**
   * List of columns to display in the search table
   */
  const columns = useMemo(() => {
    if (config.result_card.attributes) {
      return config.result_card.attributes
        .slice(0, 4)
        .map(att => ({
          render: (hit) => renderFlattenedAttribute(hit, att.name),
          label: getColumnLabel(att.name, t),
          ...att
        }))
    }

    return []
  }, [config]);

  /**
   * Navigates to the selected hit.
   */
  const onRowClick = useCallback((hit) => navigate(`${config.route}/${hit.id}`), []);

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
        }, ...columns]}
        isHighlight={(item) => isHover(item) || isSelected(item)}
        onRowClick={onRowClick}
        onRowPointerEnter={onPointEnter}
        onRowPointerLeave={onPointLeave}
        hits={hits}
      />
    </div>
  );
};

export default TableView;