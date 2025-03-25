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
import { type ReactNode, useContext, useState } from 'react';
import _ from 'underscore';

interface Props {
  children: ReactNode,
  classNames?: {
    controls?: string
    root?: string,
  };
}

const Map = (props: Props) => {
  const config = useRuntimeConfig<any>();
  const { baseLayers, dataLayers } = PeripleoUtils.filterLayers(config);

  const [baseLayer, setBaseLayer] = useState(_.first(baseLayers));
  const [overlays, setOverlays] = useState([]);

  const { t } = useContext(TranslationContext);

  return (
    <PeripleoMap
      attributionControl={false}
      className={clsx('flex-grow', props.classNames?.root)}
      style={PeripleoUtils.toLayerStyle(baseLayer, baseLayer.name)}
    >
      <div
        className={clsx('absolute top-0 right-0 flex flex-col py-3 px-3 gap-y-2', props.classNames?.controls)}
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
      { props.children }
    </PeripleoMap>
  );
};

export default Map;