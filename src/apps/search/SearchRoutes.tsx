import Place from '@apps/search/Place';
import Organization from '@apps/search/Organization';
import SearchPanel from '@apps/search/SearchPanel';
import SearchTimeline from '@apps/search/SearchTimeline';
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
          match='/organizations/'
          element={<Organization />}
        />
        <Route
          match='/places/'
          element={<Place />}
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