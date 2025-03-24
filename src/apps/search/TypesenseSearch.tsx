import { useSearchConfig } from '@apps/search/SearchContext';
import {
  FacetStateContextProvider,
  PersistentSearchStateContextProvider,
  Typesense as TypesenseUtils
} from '@performant-software/core-data';
import { useRuntimeConfig } from '@peripleo/peripleo';
import { useMemo, type ReactNode } from 'react';
import {
  InstantSearch,
  useGeoSearch,
  useInfiniteHits,
  useRange,
  useRefinementList,
  useSearchBox
} from 'react-instantsearch';

const SearchProvider = (props: { children: ReactNode }) => {
  const config = useSearchConfig();
  const geoSearch = useGeoSearch();
  const infiniteHits = useInfiniteHits();
  const searchBox = useSearchBox();

  const { typesense } = config;

  return (
    <PersistentSearchStateContextProvider
      infiniteHits={infiniteHits}
      geoSearch={geoSearch}
      searchBox={searchBox}
    >
      <FacetStateContextProvider
        apiKey={typesense.api_key}
        exclude={typesense.facets?.exclude}
        host={typesense.host}
        include={typesense.facets?.include}
        indexName={typesense.index_name}
        protocol={typesense.protocol}
        useRange={useRange}
        useRefinementList={useRefinementList}
      >
        { props.children }
      </FacetStateContextProvider>
    </PersistentSearchStateContextProvider>
  )
};

const TypesenseSearch = (props: { children: ReactNode }) => {
  const config = useSearchConfig();
  const { typesense } = config;

  const options = typesense.overrides || {};
  const adapter = useMemo(() => TypesenseUtils.createTypesenseAdapter(typesense, options), []);
  const routing = useMemo(() => TypesenseUtils.createRouting(typesense), []);

  return (
    <InstantSearch
      indexName={typesense.index_name}
      routing={routing}
      searchClient={adapter.searchClient}
      future={{
        preserveSharedStateOnUnmount: true
      }}
    >
      <SearchProvider>
        { props.children }
      </SearchProvider>
    </InstantSearch>
  )
};

export default TypesenseSearch;
