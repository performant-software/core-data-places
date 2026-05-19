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
}

const Map = (props: Props) => {
  const config = useRuntimeConfig();
  const { baseLayers, dataLayers } = PeripleoUtils.filterLayers(config);

  const [baseLayer, setBaseLayer] = useState(_.first(baseLayers));
  const [overlays, setOverlays] = useState([]);

  const { t } = useContext(TranslationContext);

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

  // Each BaseMap gets its own MapProvider. Peripleo ships a single shared
  // `MapContext` at the app root, so when a post body contains more than one
  // map (e.g. a `<place>` block and a `<map>` block), each PeripleoMap mount
  // overwrites the previous one's `setMap(...)` and `useLoadedMap()` returns
  // the wrong instance for the earlier subtree. Isolating the context per
  // BaseMap avoids the cross-contamination.
  return (
    <MapProvider>
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
          { [...baseLayers, ...dataLayers].length > 1 && (
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
    </MapProvider>
  );
};

export default Map;