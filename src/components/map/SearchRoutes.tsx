import  { CoreDataContextProvider } from '@performant-software/core-data';
import { Route, Routes, useRuntimeConfig } from '@peripleo/peripleo';
import Place from './Place';
import SearchPanel from './SearchPanel';

const SearchRoutes = () => {
  const { core_data: config }: any = useRuntimeConfig();

  return (
    <CoreDataContextProvider
      baseUrl={config.url}
      projectIds={config.project_ids}
    >
      <Routes>
        <Route
          match='/places/'
          element={<Place />}
        />
        <Route
          element={<SearchPanel />}
        />
      </Routes>
    </CoreDataContextProvider>
  );
};

export default SearchRoutes;