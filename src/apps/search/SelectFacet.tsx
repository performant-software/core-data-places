import Facet from '@apps/search/Facet';
import { Combobox } from '@performant-software/core-data';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { useRefinementList } from 'react-instantsearch';
import _ from 'underscore';

interface Props {
  attribute: string;
  className: string;
}

const SelectFacet = ({ attribute, className}: Props) => {
  const [selected, setSelected] = useState([]);
  const { items, refine, searchForItems } = useRefinementList({ attribute });

  /**
   * Returns true if the passed item is currently selected.
   */
  const isSelected = useCallback(({ value }) => !!_.findWhere(selected, { value }), [selected]);

  /**
   * Clears the existing selection from the facet.
   */
  const onClear = useCallback(() => {
    _.each(selected, ({ value }) => refine(value));
    setSelected([]);
  }, [selected]);

  /**
   * Callback fired when the combobox selection is changed. In order to display the selected values when a
   * search is executed, we must maintain a separate list for selected items, as the `items` from `useRefinementList`
   * will only contain records that match the search.
   */
  const onChange = useCallback((item) => {
    if (isSelected(item)) {
      setSelected((prevSelected) => _.filter(prevSelected, (i) => i.value !== item.value));
    } else {
      setSelected((prevSelected) => [...prevSelected, item]);
    }

    refine(item.value);
  }, [isSelected]);

  /**
   * Set the selected items when the component is mounted.
   */
  useEffect(() => {
    setSelected(_.where(items, { isRefined: true }));
  }, []);

  return (
    <Facet
      attribute={attribute}
      className={clsx('select-facet', 'text-sm', className)}
    >
      <Combobox
        className='py-2 combobox'
        onChange={onChange}
        onClear={onClear}
        onSearch={(query) => searchForItems(query)}
        options={items}
        values={selected}
      />
    </Facet>
  );
};

export default SelectFacet;