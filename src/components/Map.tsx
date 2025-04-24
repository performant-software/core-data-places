import TranslationContext from '@contexts/TranslationContext';
import {
  Icon,
  LayerMenu,
  OverlayLayers,
  Peripleo as PeripleoUtils
} from '@performant-software/core-data';
import { Map as PeripleoMap, ZoomControl } from '@peripleo/maplibre';
import { useRuntimeConfig } from '@peripleo/peripleo';
import clsx from 'clsx';
import { type ReactNode, useContext, useMemo, useState } from 'react';
import _ from 'underscore';

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

  return (
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
      <OverlayLayers
        overlays={overlays}
      />
      { props.children }
    </PeripleoMap>
  );
};

export default Map;