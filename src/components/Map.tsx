import TranslationContext from '@contexts/TranslationContext';
import { LayerMenu, OverlayLayers, Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { Map as PeripleoMap, Zoom } from '@peripleo/maplibre';
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
        className={clsx(
          'p6o-controls-container',
          'topright',
          props.classNames?.controls
        )}
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
      </div>
      <OverlayLayers
        overlays={overlays}
      />
      { props.children }
    </PeripleoMap>
  );
};

export default Map;