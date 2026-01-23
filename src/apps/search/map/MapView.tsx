import MapSearchContext from '@apps/search/map/MapSearchContext';
import { useSearchConfig } from '@apps/search/SearchConfigContext';
import Tooltip from '@apps/search/map/Tooltip';
import Map from '@components/Map';
import {
  SearchResultsLayer,
  Typesense as TypesenseUtils,
  useCachedHits,
  useGeoSearch,
  useSearching
} from '@performant-software/core-data';
import { Map as MapUtils } from '@performant-software/geospatial';
import { HoverTooltip, useLoadedMap, useSelectionValue } from '@peripleo/maplibre';
import { useCurrentRoute, useNavigate } from '@peripleo/peripleo';
import { parseFeature } from '@utils/search';
import { useContext, useEffect, useMemo, useState } from 'react';
import _ from 'underscore';

const MapView = () => {
  const [features, setFeatures] = useState([]);

  const config = useSearchConfig();
  const { isRefinedWithMap } = useGeoSearch();
  const navigate = useNavigate();
  const { selected } = useSelectionValue() || {};
  const route = useCurrentRoute();
  const hits = useCachedHits();
  const searching  = useSearching();
  const map = useLoadedMap();

  const {
    boundingBoxOptions,
    controlsClass,
    geometries,
    isPreloaded
  } = useContext(MapSearchContext);

  /**
   * If we're on the place detail page or refining results by the map view port, we'll suppress the auto-bounding box
   * on the SearchResultsLayer component. Also suppress the auto-bounding box if 'zoom_to_place' is 'false'.
   */
  const fitBoundingBox = useMemo(() => (
    !isRefinedWithMap() && route === '/' && config.map.zoom_to_place
  ), [route, isRefinedWithMap()]);

  /**
   * Sets the bounding box on the data set.
   */
  useEffect(() => {
    if (fitBoundingBox && !_.isEmpty(features) && map && !searching) {
      // Set the bounding box on the map
      const data = TypesenseUtils.createFeatureCollection(features);
      const bbox = MapUtils.getBoundingBox(data);

      if (bbox) {
        map.fitBounds(bbox, boundingBoxOptions);
      }
    }
  }, [boundingBoxOptions, fitBoundingBox, features, map, searching]);

  /**
   * Updates the set of features when the geometries or hits are changed.
   */
  useEffect(() => {
    const options = {};

    if (config.map.cluster_radius) {
      _.extend(options, { type: 'Point' });
    }

    if (isPreloaded) {
      _.extend(options, { geometries });
    }

    setFeatures(TypesenseUtils.getFeatures(features, hits, config.map.geometry, options));
  }, [geometries, hits]);

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
      { _.map(features, (feature) => (
        <SearchResultsLayer
          data={feature}
          cluster={!!config.map.cluster_radius}
          clusterRadius={config.map.cluster_radius}
          fitBoundingBox={false}
          interactive
          key={feature.properties.uuid}
          layerId={feature.properties.uuid}
        />
      ))}
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