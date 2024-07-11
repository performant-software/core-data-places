import {
    LayerMenu,
    OverlayLayers,
    Peripleo as PeripleoUtils,
    SearchResultsLayer,
    useGeoSearch
  } from '@performant-software/core-data';
import { Map, Tooltip, Zoom } from '@peripleo/maplibre';
import { Controls, useCurrentRoute, useRuntimeConfig, useNavigate, useSelectionValue } from '@peripleo/peripleo';
import React, { useEffect, useMemo, useState } from 'react';
import _ from 'underscore';
import SearchResultTooltip from './SearchResultTooltip';
import { useStats } from 'react-instantsearch';
  
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

    const { nbHits: count } = useStats();

    
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
            baseLayersLabel={'Base Layers'}
            dataLayers={dataLayers}
            onChangeBaseLayer={setBaseLayer}
            onChangeOverlays={setOverlays}
            overlaysLabel={'Overlays'}
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
          fitBoundingBox={fitBoundingBox}
          layerId={SEARCH_LAYER}
        />
        <Tooltip
          content={(target, event) => (
            <SearchResultTooltip
              event={event}
              renderMoreLabel={(count) => `+ ${count} more`}
              target={target}
            />
          )}
          layerId={TOOLTIP_LAYERS}
        />
      </Map>
    );
  };
  
  export default MapView;
  