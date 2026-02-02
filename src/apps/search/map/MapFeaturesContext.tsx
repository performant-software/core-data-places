import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Feature, FeatureCollection } from '@peripleo/peripleo';
import { Typesense, useCachedHits } from '@performant-software/core-data';
import { useSearchConfig } from '../SearchConfigContext';

interface MapFeaturesContextType {
  places: FeatureCollection;
  updatePlace(feature: Feature): void;
}

const MapFeaturesContext = createContext<MapFeaturesContextType>(null);

interface Props {
  children: ReactNode;
}

export const MapFeaturesContextProvider = ({ children }: Props) => {
  const config = useSearchConfig();
  const hits = useCachedHits();

  // May have to be an empty feature collection instead!
  const [places, setPlaces] = useState<FeatureCollection>(null);

  /**
   * Memo-izes the data to be displayed on the map as a feature collection.
   */
  useEffect(() => {
    const options = config.map.cluster_radius ? { type: 'Point' } : undefined;
    const featureCollection = Typesense.toFeatureCollection(hits, config.map.geometry, options);

    // TODO we could make this smarter! If a feature with the given ID already exists,
    // we could keep it. (Assuming that the hits would never provide a higher-res version than
    // what we already have.)
    setPlaces(featureCollection);
  }, [hits]);

  const updatePlace = (feature: Feature) => {
    const updated = places.features.map(f => f.id === feature.id ? feature : f);
    setPlaces({ type: 'FeatureCollection', features: updated });
  }

  return (
    <MapFeaturesContext.Provider
      value={{
        places,
        updatePlace
      }}
    >
      { children }
    </MapFeaturesContext.Provider>
  )
};

export const useCachedPlaces = () => {
  return useContext(MapFeaturesContext);
}