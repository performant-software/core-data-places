import {
    LayerMenu,
    OverlayLayers,
    Peripleo as PeripleoUtils,
    PlaceMarkers
  } from '@performant-software/core-data';
  import { Map, Zoom } from '@peripleo/maplibre';
  import { Controls, useRuntimeConfig } from '@peripleo/peripleo';
  import React, { useState } from 'react';
  import _ from 'underscore';
  
  const SEARCH_LAYER = 'search-results';
  
  const TOOLTIP_LAYERS = [
    'source-search-results',
    'layer-search-results-fill',
    'layer-search-results-line',
    'layer-search-results-point'
  ];

  export interface PlaceDetailMapViewProps {
    placeId: string;
  }
  
  const PlaceDetailMapView = (props: PlaceDetailMapViewProps) => {
    const { placeId } = props;
    const { baseLayers, dataLayers } = PeripleoUtils.filterLayers(useRuntimeConfig());
  
    const [baseLayer, setBaseLayer] = useState(_.first(baseLayers));
    const [overlays, setOverlays] = useState([]);
  
    return (
      <Map
        className='flex-grow sm:min-h-screen'
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
              dataLayers={dataLayers}
              onChangeBaseLayer={setBaseLayer}
              onChangeOverlays={setOverlays}
            />
          )}
        </Controls>
        <OverlayLayers
          overlays={overlays}
        />
        <PlaceMarkers
            urls={[`${import.meta.env.PUBLIC_CORE_DATA_API_URL}/${placeId}?project_ids=${import.meta.env.PUBLIC_CORE_DATA_PROJECT_ID}`]}
        />
      </Map>
    );
  };
  
  export default PlaceDetailMapView;
  