import PlacesService from '@backend/api/places';
import {
  CoreData as CoreDataUtils,
  LayerMenu,
  Peripleo as PeripleoUtils,
  OverlayLayers
} from '@performant-software/core-data';
import { LocationMarkers } from '@performant-software/geospatial';
import { Map, Zoom } from '@peripleo/maplibre';
import { Peripleo, Controls, useRuntimeConfig } from '@peripleo/peripleo';
import React, { useEffect, useMemo, useState } from 'react';
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
  const [places, setPlaces] = useState([]);

  /**
   * Converts the set of places into a FeatureCollection.
   *
   * @type {FeatureCollection<Geometry, Properties>}
   */
  const data = useMemo(() => CoreDataUtils.toFeatureCollection(places), [places]);

  /**
   * Loads the data for all the passed place IDs and sets it one the data.
   */
  useEffect(() => {
    const loaders = _.map(props.placeIds, (id) => (
      PlacesService
        .fetchOne(id)
        .then((data) => data.place)
    ));

    Promise
      .all(loaders)
      .then((data) => setPlaces(data));
  }, [props.placeIds]);

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
        <LocationMarkers
          animate={props.animate}
          buffer={props.buffer}
          data={data}
          key={`markers-${props.mapId}`}
        />
      </Map>
    </Peripleo>
  );
};

export default PlacesMap;
