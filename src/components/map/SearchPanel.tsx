import { type Feature, useHoverState, useNavigate } from '@peripleo/peripleo';
import React, { useCallback } from 'react';
import SearchBox from './SearchBox';
import SearchCount from './SearchCount';
import SearchResultsList from './SearchResultsList';
import SearchFilters from './SearchFilters';

const SearchPanel = () => {
  const { hover, setHover } = useHoverState();

  /**
   * Sets the hover state.
   */
  const onHoverChange = useCallback((nextHover: any) => (
    setHover((prevHover) => (prevHover?.id === nextHover?.id ? prevHover : nextHover))
  ), []);

  return (
    <aside
      className='flex flex-col absolute z-10 h-full w-[350px] bg-white shadow overflow-hidden'
    >
      <div
        className='flex flex-col gap-2 border-b p-5'
      >
        <div
          className='flex gap-2 items-center'
        >
          <SearchBox />
          <SearchFilters />
        </div>
        <SearchCount
          className='pt-1'
        />
      </div>
      <div
        className='overflow-y-auto flex-grow'
      >
        <SearchResultsList
          hover={hover}
          onHoverChange={onHoverChange}
        />
      </div>
    </aside>
  );
};

export default SearchPanel;
