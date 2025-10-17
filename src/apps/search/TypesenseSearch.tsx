import {
  Typesense as TypesenseUtils
} from '@performant-software/core-data';
import { useMemo, type ReactNode } from 'react';
import {
  InstantSearch, useRange, useRefinementList,
} from 'react-instantsearch';
import { useSearchConfig } from "@apps/search/SearchConfigContext";
import { FacetStateContextProvider } from "@performant-software/core-data";

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
    </InstantSearch>
  )
};

export default TypesenseSearch;
