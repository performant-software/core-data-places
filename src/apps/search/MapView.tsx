import Tooltip from '@apps/search/Tooltip';
import SearchContext from '@apps/search/SearchContext';
import TranslationContext from '@apps/search/TranslationContext';
import {
  Icon,
  LayerMenu,
  OverlayLayers,
  Peripleo as PeripleoUtils,
  SearchResultsLayer,
  Typesense as TypesenseUtils,
  useCachedHits,
  useGeoSearch,
  useSearching
} from '@performant-software/core-data';
import {
  HoverTooltip,
  Map,
  ZoomControl,
  useSelectionValue
} from '@peripleo/maplibre';
import { useCurrentRoute, useNavigate, useRuntimeConfig } from '@peripleo/peripleo';
import { parseFeature } from '@utils/search';
import clsx from 'clsx';
import {
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import _ from 'underscore';

const MapView = () => {
  const config = useRuntimeConfig<any>();
  const { baseLayers, dataLayers } = PeripleoUtils.filterLayers(config);

  const [baseLayer, setBaseLayer] = useState(_.first(baseLayers));
  const [overlays, setOverlays] = useState([]);

  const { isRefinedWithMap } = useGeoSearch();
  const navigate = useNavigate();
  const { selected } = useSelectionValue() || {};
  const route = useCurrentRoute();
  const hits = useCachedHits();
  const searching  = useSearching();

  const { boundingBoxOptions, controlsClass } = useContext(SearchContext);
  const { t } = useContext(TranslationContext);

  /**
   * Memo-izes the data to be displayed on the map as a feature collection.
   */
  const data = useMemo(() => {
    const options = config.map.cluster_radius ? { type: 'Point' } : undefined;
    return TypesenseUtils.toFeatureCollection(hits, config.map.geometry, options);
  }, [hits]);

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
        navigate(`${config.search.route}/${id}`);
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
      <div
        className={clsx('absolute top-0 right-0 flex flex-col py-3 px-3 gap-y-2', controlsClass)}
      >
        <ZoomControl
          zoomIn={<Icon name='zoom_in' />}
          zoomInProps={{ className: 'p6o-control p6o-control-btn' }}
          zoomOut={<Icon name='zoom_out' />}
          zoomOutProps={{ className: 'p6o-control p6o-control-btn' }}
        />
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
      </div>
      <OverlayLayers
        overlays={overlays}
      />
      <SearchResultsLayer
        boundingBoxOptions={boundingBoxOptions}
        data={data}
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