import MapSearchContext from '@apps/search/map/MapSearchContext';
import Tooltip from '@apps/search/map/Tooltip';
import Map from '@components/Map';
import {
  SearchResultsLayer,
  // Typesense as TypesenseUtils,
  // useCachedHits,
  useGeoSearch,
  useSearching
} from '@performant-software/core-data';
import { HoverTooltip, useSelectionValue } from '@peripleo/maplibre';
import { Feature, FeatureCollection, useCurrentRoute, useNavigate } from '@peripleo/peripleo';
import { parseFeature } from '@utils/search';
import { useContext, useEffect, useMemo, useState } from 'react';
import _ from 'underscore';
import { useSearchConfig } from '@apps/search/SearchConfigContext';
import { useCachedPlaces } from './MapFeaturesContext';

const MapView = () => {
  const config = useSearchConfig();
  const { isRefinedWithMap } = useGeoSearch();
  const navigate = useNavigate();
  const { selected } = useSelectionValue() || {};
  const route = useCurrentRoute();
  // const hits = useCachedHits();
  const places = useCachedPlaces();
  const searching  = useSearching();

  const { boundingBoxOptions, controlsClass } = useContext(MapSearchContext);

  /**
   * Memo-izes the data to be displayed on the map as a feature collection.
   *
  const data = useMemo(() => {
    const options = config.map.cluster_radius ? { type: 'Point' } : undefined;
    return TypesenseUtils.toFeatureCollection(hits, config.map.geometry, options);
  }, [hits]);
  */

  /**
   * If we're on the place detail page or refining results by the map view port, we'll suppress the auto-bounding box
   * on the SearchResultsLayer component. Also suppress the auto-bounding box if 'zoom_to_place' is 'false'.
  */
 const fitBoundingBox = useMemo(() => (
   !isRefinedWithMap() && route === '/' && config.map.zoom_to_place
  ), [route, isRefinedWithMap()]);

  /**
   * Navigates to the selected marker.
   */
  useEffect(() => {
    if (selected) {
      let id;

      /**
       * If the selected item only represents a single search result, navigate directly to the item. Otherwise (for
       * a cluster or location that represents multiple search results) navigate to the '/select' route to allow
       * the user to choose which record to view.
       */
      if (!_.isArray(selected)) {
        const { properties = {} }: any = parseFeature(selected);

        if (properties.items.length === 1) {
          const [item,] = properties.items;
          id = item?.uuid;
        }
      }

      if (id) {
        navigate(`${config.route}/${id}`);
      } else {
        navigate('/select');
      }
    }
  }, [selected]);

  return (
    <Map
      classNames={{
        controls: controlsClass
      }}
    >
      <SearchResultsLayer
        boundingBoxOptions={boundingBoxOptions}
        data={places}
        cluster={!!config.map.cluster_radius}
        clusterRadius={config.map.cluster_radius}
        fitBoundingBox={fitBoundingBox}
        geometry={config.map.geometry}
        interactive
        searching={searching}
      />
      <HoverTooltip
        tooltip={({ hovered }) => (
          <Tooltip
            hovered={hovered}
          />
        )}
      />
    </Map>
  );
};

export default MapView;