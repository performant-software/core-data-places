import SearchResultTooltip from '@apps/search/SearchResultTooltip';
import TranslationContext from '@apps/search/TranslationContext';
import config from '@config';
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
  const { baseLayers, dataLayers } = PeripleoUtils.filterLayers(useRuntimeConfig());

  const [baseLayer, setBaseLayer] = useState(_.first(baseLayers));
  const [overlays, setOverlays] = useState([]);

  const { isRefinedWithMap } = useGeoSearch();

  const navigate = useNavigate();
  const selected = useSelectionValue<any>();
  const route = useCurrentRoute();

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
      navigate(`/places/${selected.properties.uuid}`);
    }
  }, [selected]);

  return (
    <Map
      className='flex-grow'
      style={PeripleoUtils.toLayerStyle(baseLayer, baseLayer.name)}
    >
      <Controls
        position='topright'
      >
        <Zoom />
        { baseLayers.length > 1 && (
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
        boundingBoxOptions={{
          padding: {
            top: 100,
            bottom: 100,
            left: 380,
            right: 120
          },
          maxZoom: 14
        }}
        cluster={!!config.search.cluster_radius}
        clusterRadius={config.search.cluster_radius}
        fitBoundingBox={fitBoundingBox}
        layerId={SEARCH_LAYER}
      />
      <Tooltip
        content={(target, event) => (
          <SearchResultTooltip
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