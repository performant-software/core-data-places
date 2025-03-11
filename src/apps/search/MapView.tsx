import ResultTooltip from '@apps/search/ResultTooltip';
import SearchContext from '@apps/search/SearchContext';
import Map from '@components/Map';
import { SearchResultsLayer, useGeoSearch } from '@performant-software/core-data';
import { Tooltip } from '@peripleo/maplibre';
import {
  useCurrentRoute,
  useNavigate,
  useRuntimeConfig,
  useSelectionValue
} from '@peripleo/peripleo';
import { parseFeature } from '@utils/map';
import { useContext, useEffect, useMemo, } from 'react';

const SEARCH_LAYER = 'search-results';

const TOOLTIP_LAYERS = [
  'source-search-results',
  'layer-search-results-fill',
  'layer-search-results-line',
  'layer-search-results-point'
];

const MapView = () => {
  const config = useRuntimeConfig<any>();
  const { isRefinedWithMap } = useGeoSearch();
  const navigate = useNavigate();
  const selected = useSelectionValue<any>();
  const route = useCurrentRoute();

  const { boundingBoxOptions, controlsClass } = useContext(SearchContext);

  /**
   * If we're on the place detail page or refining results by the map view port, we'll suppress the auto-bounding box
   * on the SearchResultsLayer component.
  */
 const fitBoundingBox = useMemo(() => !isRefinedWithMap() && route === '/', [route, isRefinedWithMap()]);

  /**
   * Navigates to the selected marker.
   */
  useEffect(() => {
    if (selected) {
      const { properties = {} }: any = parseFeature(selected);

      if (properties.items.length === 1) {
        const [item,] = properties.items;
        navigate(`${config.search.route}/${item.uuid}`);
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
      <>
        <SearchResultsLayer
          boundingBoxOptions={boundingBoxOptions}
          cluster={!!config.map.cluster_radius}
          clusterRadius={config.map.cluster_radius}
          fitBoundingBox={fitBoundingBox}
          geometry={config.map.geometry}
          layerId={SEARCH_LAYER}
        />
        <Tooltip
          content={(target, event) => (
            <ResultTooltip
              event={event}
              target={target as any}
            />
          )}
          layerId={TOOLTIP_LAYERS}
        />
      </>
    </Map>
  );
};

export default MapView;