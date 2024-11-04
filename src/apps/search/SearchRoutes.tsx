import Place from '@apps/search/Place';
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
          match='/places/'
          element={<Place />}
        />
        <Route
          element={(
            <>
              <SearchPanel />
              { config.search.timeline && (
                <SearchTimeline />
              )}
            </>
          )}
        />
      </Routes>
    </CoreDataContextProvider>
  );
};

export default SearchRoutes;