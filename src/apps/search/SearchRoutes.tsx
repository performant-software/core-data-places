import Event from '@apps/search/panels/Event';
import Instance from '@apps/search/panels/Instance';
import Item from '@apps/search/panels/Item';
import Person from '@apps/search/panels/Person';
import Place from '@apps/search/panels/Place';
import Organization from '@apps/search/panels/Organization';
import Work from '@apps/search/panels/Work';
import SearchPanel from '@apps/search/SearchPanel';
import SearchTimeline from '@apps/search/timeline/SearchTimeline';
import { CoreDataContextProvider } from '@performant-software/core-data';
import { Route, Routes, useRuntimeConfig } from '@peripleo/peripleo';

const SearchRoutes = () => {
  const config: any = useRuntimeConfig();

  return (
    <CoreDataContextProvider
      baseUrl={config.core_data.url}
      projectIds={config.core_data.project_ids}
    >
      <Routes>
        <Route
          match='/events/'
          element={<Event />}
        />
        <Route
          match='/instances/'
          element={<Instance />}
        />
        <Route
          match='/item/'
          element={<Item />}
        />
        <Route
          match='/organizations/'
          element={<Organization />}
        />
        <Route
          match='/people/'
          element={<Person />}
        />
        <Route
          match='/places/'
          element={<Place />}
        />
        <Route
          match='/work/'
          element={<Work />}
        />
        <Route
          element={(
            <>
              <SearchPanel />
              { config.search.event_range && (
                <SearchTimeline
                  attribute={config.search.event_range}
                />
              )}
            </>
          )}
        />
      </Routes>
    </CoreDataContextProvider>
  );
};

export default SearchRoutes;