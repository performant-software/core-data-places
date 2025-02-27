import Facet from '@apps/search/Facet';
import { Combobox } from '@performant-software/core-data';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { useRefinementList } from 'react-instantsearch';
import _ from 'underscore';

interface Props {
  attribute: string;
  className: string;
}

const SelectFacet = ({ attribute, className}: Props) => {
  const { items, refine, searchForItems } = useRefinementList({ attribute });

  /**
   * Memo-izes the selected items.
   */
  const values = useMemo(() => _.where(items, { isRefined: true }), [items]);

  /**
   * Clears the existing selection from the facet.
   */
  const onClear = useCallback(() => _.each(values, ({ value }) => refine(value)), [values]);

  return (
    <Facet
      attribute={attribute}
      className={clsx('text-sm', className)}
    >
      <Combobox
        onChange={({ value }) => refine(value)}
        onClear={onClear}
        onSearch={(query) => searchForItems(query)}
        options={items || []}
        values={values || []}
      />
    </Facet>
  );
};

export default SelectFacet;