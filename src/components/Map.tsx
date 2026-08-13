import TranslationContext from '@contexts/TranslationContext';
import {
  Icon,
  LayerMenu,
  OverlayLayers,
  Peripleo as PeripleoUtils
} from '@performant-software/core-data';
import { Map as PeripleoMap, useLoadedMap, ZoomControl } from '@peripleo/maplibre';
import { MapProvider, useRuntimeConfig } from '@peripleo/peripleo';
import clsx from 'clsx';
import { type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import _ from 'underscore';

/**
 * Defers rendering children until the underlying MapLibre style has fully
 * loaded. Peripleo's `useLoadedMap` returns the map synchronously the moment a
 * style prop is provided to `<PeripleoMap>`, even though MapLibre hasn't
 * finished parsing the style yet. Layer-adding children (e.g. `LocationMarkers`
 * via `GeoJSONLayer`) then call `map.getStyle().layers` and crash because the
 * style is undefined. Gating on `isStyleLoaded()` and the `styledata` /`load`
 * events avoids that race.
 */
const WhenStyleLoaded = ({ children }: { children: ReactNode }) => {
  const map = useLoadedMap() as any;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!map) return;
    if (typeof map.isStyleLoaded === 'function' && map.isStyleLoaded()) {
      setReady(true);
      return;
    }
    const onReady = () => setReady(true);
    map.once?.('styledata', onReady);
    map.once?.('load', onReady);
    return () => {
      map.off?.('styledata', onReady);
      map.off?.('load', onReady);
    };
  }, [map]);

  return ready ? <>{children}</> : null;
};

interface Props {
  children: ReactNode,
  classNames?: {
    controls?: string
    root?: string,
  };
  /**
   * When `true` (the default), the map is wrapped in its own `MapProvider` so it
   * gets an isolated `MapContext`. This is required when several maps are mounted
   * under the same Peripleo root (e.g. a post body with multiple map blocks),
   * where a shared context would let each `PeripleoMap` overwrite the previous
   * one's `setMap(...)`.
   *
   * Set to `false` when the consumer renders a single map and has ancestor
   * components (outside `<Map>`) that need to read the map via `useLoadedMap()` —
   * e.g. map search, where `MapView`/`MapSearchContext` compute the bounding box.
   * Those ancestors read the root `MapProvider` supplied by `<Peripleo>`, so the
   * map must register there rather than in a nested provider.
   */
  isolate?: boolean;
  showLayerMenu?: boolean;
}

const Map = (props: Props) => {
  const config = useRuntimeConfig();
  const { baseLayers, dataLayers } = PeripleoUtils.filterLayers(config);

  const [baseLayer, setBaseLayer] = useState(_.first(baseLayers));
  const [overlays, setOverlays] = useState([]);

  const { t } = useContext(TranslationContext);

  const showLayerMenu = typeof props.showLayerMenu === 'boolean'
    ? props.showLayerMenu
    : true;

  /**
   * Memo-izes the class to apply to the map control buttons.
   */
  const buttonClass = useMemo(() => [
    'bg-gray-50',
    'shadow',
    'rounded-full',
    'h-[40px]',
    'w-[40px]',
    'flex',
    'justify-center',
    'items-center',
    'hover:opacity-90'
  ].join(' '), []);

  const { isolate = true } = props;

  const map = (
    <PeripleoMap
      attributionControl={false}
      className={clsx('grow', props.classNames?.root)}
      style={PeripleoUtils.toLayerStyle(baseLayer, baseLayer.name)}
    >
      <div
        className={clsx('absolute top-0 right-0 flex flex-col py-3 px-3 gap-y-2', props.classNames?.controls)}
      >
        <ZoomControl
          zoomIn={<Icon name='zoom_in' />}
          zoomInProps={{ className: buttonClass }}
          zoomOut={<Icon name='zoom_out' />}
          zoomOutProps={{ className: buttonClass }}
        />
        { showLayerMenu && [...baseLayers, ...dataLayers].length > 1 && (
          <LayerMenu
            baseLayer={baseLayer?.name}
            baseLayers={baseLayers}
            baseLayersLabel={t('baseLayers')}
            className={buttonClass}
            dataLayers={dataLayers}
            onChangeBaseLayer={setBaseLayer}
            onChangeOverlays={setOverlays}
            overlaysLabel={t('overlays')}
          />
        )}
      </div>
      <WhenStyleLoaded>
        <OverlayLayers
          overlays={overlays}
        />
        { props.children }
      </WhenStyleLoaded>
    </PeripleoMap>
  );

  // By default each BaseMap gets its own MapProvider. Peripleo ships a single
  // shared `MapContext` at the app root, so when a post body contains more than
  // one map (e.g. a `<place>` block and a `<map>` block), each PeripleoMap mount
  // overwrites the previous one's `setMap(...)` and `useLoadedMap()` returns the
  // wrong instance for the earlier subtree. Isolating the context per BaseMap
  // avoids the cross-contamination.
  //
  // When `isolate` is `false`, we skip the nested provider so the map registers
  // into the root `MapProvider` from `<Peripleo>`. This lets ancestor components
  // (e.g. `MapView`/`MapSearchContext`) read the map via `useLoadedMap()` — they
  // live outside `<Map>` and otherwise never see the instance.
  return isolate ? <MapProvider>{ map }</MapProvider> : map;
};

export default Map;