import type { ReactNode } from "react";
import { useGeoSearch, useInfiniteHits, useSearchBox } from "react-instantsearch";
import { PersistentSearchStateContextProvider } from "@performant-software/core-data";
import { useSearchConfig } from "@apps/search/SearchConfigContext";

const MapSearchProvider = (props: { children: ReactNode }) => {
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
      {props.children}
    </PersistentSearchStateContextProvider>
  )
};

export default MapSearchProvider;
