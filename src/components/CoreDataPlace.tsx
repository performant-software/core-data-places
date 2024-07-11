import { Peripleo, Controls, RuntimeConfig, useRuntimeConfig } from '@peripleo/peripleo';
import { Map, Zoom } from '@peripleo/maplibre';
import { PlaceMarkers, Peripleo as PeripleoUtils, OverlayLayers } from '@performant-software/core-data';
import { translations } from '../helpers/i18n';
import { useEffect, useState } from 'react';
import _ from 'underscore';

interface CoreDataPlaceProps {
  placeURIs: string[];
  animate?: boolean;
  buffer?: number;
  layer?: number[];
  mapId?: string;
};

const CoreDataPlace = (props: CoreDataPlaceProps) => {
  const { baseLayers, dataLayers } = PeripleoUtils.filterLayers(useRuntimeConfig());
  
  const [baseLayer, setBaseLayer] = useState(_.first(baseLayers));
  const [overlays, setOverlays] = useState([]);

  useEffect(() => {
    const getOverlays = async (placeURI: string, layers: number[]) => {
      const placeData = await fetch(placeURI).then((res) => res.json());
      if (layers && placeData?.place_layers && placeData.place_layers.length > 0) {
        setOverlays(placeData.place_layers.filter((layer: any) => layers.includes(layer.id)));
      }
    }

    //let's lazily just care about the first place on the list for now
    if (props?.placeURIs && props.placeURIs.length > 0 && props.layer) {
      getOverlays(props.placeURIs[0], props.layer);
    }
    else {
      setOverlays([]);
    }
  }, [props.layer, props.placeURIs]);

  useEffect(() => {
    return () => {
      setOverlays([]);
    };
  }, []);

  return (
      <Peripleo>
        <Map style={PeripleoUtils.toLayerStyle(baseLayer, baseLayer.name)}>
          <Controls position="topright">
            <div onClick={(e: any) => {e.stopPropagation()}}>
              <Zoom />
            </div>
            {/* { baseLayers.length > 1 && (
            <LayerMenu
              baseLayer={baseLayer?.name}
              baseLayers={baseLayers}
              dataLayers={dataLayers}
              onChangeBaseLayer={setBaseLayer}
              onChangeOverlays={setOverlays}
            />
          )} */}
          </Controls>
          <OverlayLayers
            overlays={overlays}
            key={`overlay-${props.mapId}`}
          />
          <PlaceMarkers
            urls={props.placeURIs}
            buffer={props.buffer}
            animate={props.animate}
            key={`markers-${props.mapId}`}
          />
        </Map>
      </Peripleo>
  )

};

export default CoreDataPlace;

