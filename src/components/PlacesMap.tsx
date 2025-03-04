import { getPlaceURL } from '@backend/core-data';
import {
  LayerMenu,
  PlaceMarkers,
  Peripleo as PeripleoUtils,
  OverlayLayers
} from '@performant-software/core-data';
import { Map, Zoom } from '@peripleo/maplibre';
import { Peripleo, Controls, useRuntimeConfig } from '@peripleo/peripleo';
import { useMemo, useState } from 'react';
import _ from 'underscore';

interface Props {
  animate?: boolean;
  buffer?: number;
  layer?: number[];
  mapId?: string;
  placeIds: string[];
}

const PlacesMap = (props: Props) => {
  const { baseLayers, dataLayers } = PeripleoUtils.filterLayers(useRuntimeConfig());

  const [baseLayer, setBaseLayer] = useState(_.first(baseLayers));
  const [overlays, setOverlays] = useState([]);

  const urls = useMemo(() => _.map(props.placeIds, getPlaceURL), [props.placeIds]);

  /**
   * Commenting this section out for now as the warped image layers are not currently working with the current
   * version of Peripleo. We'll need to update Periple to 0.7.4 and set the MapLibre `preserveDrawingBuffer` prop
   * to "true".
   */
  // const PlacesService = usePlacesService();
  // const onLoad = useCallback((places) => {
  //   const layers = _.flatten(
  //     _.map(places, (place) => _.filter(place.place_layers, (pl) => props.layer.includes(pl.id)))
  //   );
  //
  //   setOverlays(layers);
  // }, [props.layer]);
  //
  // useEffect(() => {
  //   const loaders = _.map(props.placeIds, (id) => (
  //     PlacesService
  //       .fetchOne(id)
  //       .then((data) => data.place)
  //   ));
  //
  //   Promise
  //     .all(loaders)
  //     .then(onLoad);
  // }, [props.placeIds]);

  return (
    <Peripleo>
      <Map
        style={PeripleoUtils.toLayerStyle(baseLayer, baseLayer.name)}
      >
        <div onClick={(e: any) => { e.stopPropagation(); }}>
          <Controls
            position='topright'
          >
            <Zoom />
            { baseLayers.length > 1 && (
              <LayerMenu
                baseLayer={baseLayer?.name}
                baseLayers={baseLayers}
                baseLayersLabel={'Base Layers'}
                dataLayers={dataLayers}
                onChangeBaseLayer={setBaseLayer}
                onChangeOverlays={setOverlays}
                overlaysLabel={'Overlays'}
              />
            )}
          </Controls>
        </div>
        <OverlayLayers
          overlays={overlays}
          key={`overlay-${props.mapId}`}
        />
        <PlaceMarkers
          urls={urls}
          buffer={props.buffer}
          animate={props.animate}
          key={`markers-${props.mapId}`}
        />
      </Map>
    </Peripleo>
  );
};

export default PlacesMap;
