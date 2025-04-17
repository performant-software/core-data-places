import { useSearchConfig } from '@apps/search/SearchContext';
import SearchHighlight from '@apps/search/SearchHighlight';
import useHoverable from '@apps/search/useHoverable';
import useSelectable from '@apps/search/useSelectable';
import TranslationContext from '@contexts/TranslationContext';
import { SearchResultsTable, useCachedHits } from '@performant-software/core-data';
import { useNavigate } from '@peripleo/peripleo';
import { getAttributes, getColumnLabel, getHitValue } from '@root/src/utils/search';
import clsx from 'clsx';
import { useCallback, useContext, useMemo } from 'react';
import _ from 'underscore';

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
  const columns = useMemo(() => _.map(getAttributes(config), (attr) => ({
    render: (hit) => getHitValue(hit, attr.name),
    label: getColumnLabel(attr.name, t),
    ...attr
  })), [config]);

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
        'backdrop-blur-sm',
        'shadow-sm',
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
              classNames={{
                highlight: 'text-sm line-clamp-3 leading-6'
              }}
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