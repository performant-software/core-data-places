import MapSearchContext, { LayerTypes } from '@apps/search/map/MapSearchContext';
import MultiLayer from '@apps/search/map/MultiLayer';
import SingleLayer from '@apps/search/map/SingleLayer';
import { useSearchConfig } from '@apps/search/SearchConfigContext';
import Map from '@components/Map';
import { useGeoSearch, useSearching } from '@performant-software/core-data';
import { useLoadedMap, useSelectionValue } from '@peripleo/maplibre';
import { useCurrentRoute, useNavigate } from '@peripleo/peripleo';
import { useContext, useEffect, useMemo } from 'react';
import _ from 'underscore';

const MapView = () => {
  const config = useSearchConfig();
  const { isRefinedWithMap } = useGeoSearch();
  const map = useLoadedMap();
  const navigate = useNavigate();
  const route = useCurrentRoute();
  const searching  = useSearching();
  const { selected } = useSelectionValue() || {};

  const {
    boundingBoxOptions,
    controlsClass,
    features,
    getBoundingBox,
    layerType
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
      getBoundingBox().then((bbox) => map.fitBounds(bbox, boundingBoxOptions));
    }
  }, [boundingBoxOptions, fitBoundingBox, features, map, searching]);

  /**
   * Navigate to the `/select` route when feature is selected.
   */
  useEffect(() => {
    if (selected) {
      navigate('/select');
    }
  }, [selected]);

  return (
    <Map
      classNames={{
        controls: controlsClass
      }}
    >
      { layerType === LayerTypes.single && (
        <SingleLayer
          data={features}
        />
      )}
      { layerType === LayerTypes.multiple && (
        <MultiLayer
          data={features}
        />
      )}
    </Map>
  );
};

export default MapView;