import ResultTooltip from '@apps/search/ResultTooltip';
import SearchContext from '@apps/search/SearchContext';
import TranslationContext from '@apps/search/TranslationContext';
import {
    LayerMenu,
    OverlayLayers,
    Peripleo as PeripleoUtils,
    SearchResultsLayer,
    useGeoSearch
} from '@performant-software/core-data';
import { Map, Tooltip, Zoom } from '@peripleo/maplibre';
import {
  Controls,
  useCurrentRoute,
  useNavigate,
  useRuntimeConfig,
  useSelectionValue
} from '@peripleo/peripleo';
import { parseFeature } from '@utils/search';
import {
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import _ from 'underscore';

const SEARCH_LAYER = 'search-results';

const TOOLTIP_LAYERS = [
  'source-search-results',
  'layer-search-results-fill',
  'layer-search-results-line',
  'layer-search-results-point'
];

const MapView = () => {
  const config = useRuntimeConfig<any>();
  const { baseLayers, dataLayers } = PeripleoUtils.filterLayers(config);

  const [baseLayer, setBaseLayer] = useState(_.first(baseLayers));
  const [overlays, setOverlays] = useState([]);

  const { isRefinedWithMap } = useGeoSearch();
  const navigate = useNavigate();
  const selected = useSelectionValue<any>();
  const route = useCurrentRoute();

  const { boundingBoxOptions } = useContext(SearchContext);
  const { t } = useContext(TranslationContext);

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
      attributionControl={false}
      className='flex-grow'
      style={PeripleoUtils.toLayerStyle(baseLayer, baseLayer.name)}
    >
      <Controls
        position='topright'
      >
        <Zoom />
        { [...baseLayers, ...dataLayers].length > 1 && (
          <LayerMenu
            baseLayer={baseLayer?.name}
            baseLayers={baseLayers}
            baseLayersLabel={t('baseLayers')}
            dataLayers={dataLayers}
            onChangeBaseLayer={setBaseLayer}
            onChangeOverlays={setOverlays}
            overlaysLabel={t('overlays')}
          />
        )}
      </Controls>
      <OverlayLayers
        overlays={overlays}
      />
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
            target={target}
          />
        )}
        layerId={TOOLTIP_LAYERS}
      />
    </Map>
  );
};

export default MapView;