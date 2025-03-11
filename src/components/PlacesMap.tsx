import PlacesService from '@backend/api/places';
import Map from '@components/Map';
import { CoreData as CoreDataUtils } from '@performant-software/core-data';
import { LocationMarkers } from '@performant-software/geospatial';
import { useSelectionValue } from '@peripleo/peripleo';
import React, { useEffect, useMemo, useState } from 'react';
import _ from 'underscore';

interface Props {
  animate?: boolean;
  buffer?: number;
  mapId?: string;
  placeIds: string[];
}

const PlacesMap = (props: Props) => {
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
