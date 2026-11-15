import { ReactNode, useCallback, useRef } from 'react';
import { useGeoSearch, useInfiniteHits, useSearchBox } from 'react-instantsearch';
import { PersistentSearchStateContextProvider } from '@performant-software/core-data';

const MapSearchProvider = (props: { children: ReactNode }) => {
  const geoSearch = useGeoSearch();
  const infiniteHits = useInfiniteHits();
  const searchBox = useSearchBox();

  const latest = useRef(infiniteHits);
  latest.current = infiniteHits;

  const requestedFor = useRef<unknown>(null);

  /**
   * Asks for the next page of results once for each set of results received.
   */
  const showMore = useCallback(() => {
    // Temporary workaround for performant-software/react-components#618. The core-data package asks for the next
    // page on a timer each time its cache changes, and the first page can change the cache twice. Two timers then
    // ask for two pages at once, and the hits of the first of those pages are lost. Remove this once the package
    // carries the fix.
    const { results, showMore: showNextPage } = latest.current;

    if (requestedFor.current !== results) {
      requestedFor.current = results;
      showNextPage();
    }
  }, []);

  return (
    <PersistentSearchStateContextProvider
      infiniteHits={{ ...infiniteHits, showMore }}
      geoSearch={geoSearch}
      searchBox={searchBox}
    >
      { props.children }
    </PersistentSearchStateContextProvider>
  )
};

export default MapSearchProvider;
