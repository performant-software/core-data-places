import { ReactNode, useCallback, useRef } from 'react';
import { useGeoSearch, useInfiniteHits, useSearchBox } from 'react-instantsearch';
import { PersistentSearchStateContextProvider } from '@performant-software/core-data';

const MapSearchProvider = (props: { children: ReactNode }) => {
  const geoSearch = useGeoSearch();
  const infiniteHits = useInfiniteHits();
  const searchBox = useSearchBox();

  const latest = useRef(infiniteHits);
  latest.current = infiniteHits;

  const latestGeoSearch = useRef(geoSearch);
  latestGeoSearch.current = geoSearch;

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

  /**
   * Filters the search by the map's bounds, unless the map spans half of the globe or more from west to east.
   */
  const refine = useCallback((bounds) => {
    // Temporary workaround. Typesense reads the four corners of the bounds as a shape on the globe, and each edge
    // takes the shorter way around. Bounds that span more than 180 degrees of longitude therefore cover the
    // opposite side of the globe, and the search finds none of the places on the map. The core-data package drops
    // the filter above 200 degrees only. Remove this once the package drops it at 180 degrees.
    const { clearMapRefinement, isRefinedWithMap, refine: refineWithMap } = latestGeoSearch.current;

    if (bounds.northEast.lng - bounds.southWest.lng < 180) {
      refineWithMap(bounds);
    } else if (isRefinedWithMap()) {
      clearMapRefinement();
    }
  }, []);

  return (
    <PersistentSearchStateContextProvider
      infiniteHits={{ ...infiniteHits, showMore }}
      geoSearch={{ ...geoSearch, refine }}
      searchBox={searchBox}
    >
      { props.children }
    </PersistentSearchStateContextProvider>
  )
};

export default MapSearchProvider;
