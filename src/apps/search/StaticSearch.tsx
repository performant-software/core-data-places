import { useSearchConfig } from '@apps/search/SearchConfigContext';
import StaticFacetStateProvider from '@apps/search/StaticFacetStateProvider';
import StaticSearchContext from '@apps/search/StaticSearchContext';
import Loader from '@components/Loader';
import { Typesense as TypesenseUtils } from '@performant-software/core-data';
import type { StaticSearchConfig } from '@types';
import { createStaticSearchClient, loadIndex, type ItemsJsOptions } from '@utils/staticSearch';
import StaticSearchWorker from '@utils/staticSearch.worker?worker';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { InstantSearch } from 'react-instantsearch';

interface Index {
  options: ItemsJsOptions;
  searchClient: any;
}

const StaticSearch = (props: { children: ReactNode }) => {
  const config = useSearchConfig();
  const staticSearch = config.static as StaticSearchConfig;

  const [index, setIndex] = useState<Index>();

  const routing = useMemo(() => TypesenseUtils.createRouting(staticSearch), [staticSearch]);

  useEffect(() => {
    let current = true;

    const worker = new StaticSearchWorker();

    loadIndex(worker, staticSearch.index_name)
      .then((options) => {
        if (current) {
          setIndex({ options, searchClient: createStaticSearchClient(worker) });
        }
      });

    return () => {
      current = false;
      worker.terminate();
    };
  }, [staticSearch.index_name]);

  if (!index) {
    return (
      <div
        className='flex justify-center items-center w-full py-12'
      >
        <Loader
          active
          size={40}
        />
      </div>
    );
  }

  return (
    <InstantSearch
      indexName={staticSearch.index_name}
      routing={routing}
      searchClient={index.searchClient}
      future={{
        preserveSharedStateOnUnmount: true
      }}
    >
      <StaticSearchContext.Provider
        value={{ options: index.options }}
      >
        <StaticFacetStateProvider
          exclude={staticSearch.facets?.exclude}
          include={staticSearch.facets?.include}
          options={index.options}
        >
          { props.children }
        </StaticFacetStateProvider>
      </StaticSearchContext.Provider>
    </InstantSearch>
  );
};

export default StaticSearch;
