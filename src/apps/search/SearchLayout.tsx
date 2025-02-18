import MapView from '@apps/search/MapView';
import Facets from '@apps/search/Facets';
import Header, { Views } from '@apps/search/Header';
import ListView from '@apps/search/ListView';
import SearchRoutes from '@apps/search/SearchRoutes';
import TableView from '@apps/search/TableView';
import clsx from 'clsx';
import { useState } from 'react';

const SearchLayout = () => {
  const [filters, setFilters] = useState<boolean>(false);
  const [view, setView] = useState<string>(Views.list);

  return (
    <>
      <div
        className='absolute left-0 right-0 bottom-0 top-[80px]'
      >
        <MapView />
      </div>
      <Header
        className='h-[80px]'
        filters={filters}
        onFiltersChange={setFilters}
        onViewChange={setView}
        view={view}
      />
      <div
        className='flex flex-grow h-[calc(100vh-160px)]'
      >
        { (view === Views.list || filters) && (
          <div
            className={clsx('flex', { 'flex-grow': view === Views.list })}
          >
            { filters && (
              <div
                className='flex flex-col'
              >
                <Facets
                  className='w-[240px]'
                />
              </div>
            )}
            { view === Views.list && (
              <div
                className='flex flex-col'
              >
                <ListView
                  className='w-[350px]'
                />
              </div>
            )}
          </div>
        )}
        { view === Views.table && (
          <div
            className='flex flex-grow items-end'
          >
            <TableView
              className='h-[350px]'
            />
          </div>
        )}
        <div
          className='flex justify-end'
        >
          <SearchRoutes
            className='w-[350px]'
          />
        </div>
      </div>
    </>
  );
};

export default SearchLayout;