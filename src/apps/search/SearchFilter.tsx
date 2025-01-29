import { useMemo } from 'react';
import { RefinementList, useRefinementList } from 'react-instantsearch';

const FACET_LIMIT = 10;
const MAX_FACET_LIMIT = Math.pow(2, 31) - 1;

interface Props {
  attribute: string
}

const SearchFilter = (props: Props) => {
  const { items } = useRefinementList({ attribute: props.attribute, limit: MAX_FACET_LIMIT - 1 });

  /**
   * Memo-izes the "showMore" attribute.
   */
  const showMore = useMemo(() => items.length > FACET_LIMIT, [items]);

  /**
   * Memo-izes the "showMoreLimit" attribute.
   */
  const showMoreLimit = useMemo(() => Math.max(items.length, FACET_LIMIT), [items]);

  return (
    <RefinementList
      attribute={props.attribute}
      limit={FACET_LIMIT}
      showMore={showMore}
      showMoreLimit={showMoreLimit}
    />
  );
}

export default SearchFilter;