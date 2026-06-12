import PlacesService from '@backend/api/coreData/places';
import { CoreData as CoreDataUtils } from '@performant-software/core-data';
import { useEffect, useMemo, useState } from 'react';
import _ from 'underscore';

/**
 * Custom hook to fetch and transform place data into a FeatureCollection.
 *
 * @param placeIds - Array of place IDs to fetch
 * @returns FeatureCollection of the fetched places
 */
const usePlacesFeatures = (placeIds: string[]) => {
  const [places, setPlaces] = useState([]);

  /**
   * Converts the set of places into a FeatureCollection.
   *
   * @type {FeatureCollection<Geometry, Properties>}
   */
  const data = useMemo(() => CoreDataUtils.toFeatureCollection(places), [places]);

  /**
   * Loads the data for all the passed place IDs and sets it on the data.
   */
  useEffect(() => {
    const loaders = _.map(placeIds, (id) => (
      PlacesService
        .fetchOne(id)
        .then((data) => data.place)
    ));

    Promise
      .all(loaders)
      .then((data) => setPlaces(data));
  }, [placeIds]);

  return data;
};

export default usePlacesFeatures;