import React from 'react';
import Map from '@components/Map';
import { LocationMarkers } from '@performant-software/geospatial';
import usePlacesFeatures from '@root/src/hooks/usePlacesFeatures';

interface Props {
  animate?: boolean;
  buffer?: number;
  mapId?: string;
  placeIds: string[];
}

const PlacesMap = (props: Props) => {
  const data = usePlacesFeatures(props.placeIds);

  return (
    <Map>
      <LocationMarkers
        animate={props.animate}
        buffer={props.buffer || undefined}
        data={data}
        layerId={`markers-${props.mapId}`}
      />
    </Map>
  );
};

export default PlacesMap;
