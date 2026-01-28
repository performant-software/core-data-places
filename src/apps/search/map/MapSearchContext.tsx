import { useSearchConfig } from '@apps/search/SearchConfigContext';
import { fetchGeometries } from '@backend/api/geometry';
import { Typesense as TypesenseUtils, useCachedHits } from '@performant-software/core-data';
import { Map as MapUtils } from '@performant-software/geospatial';
import { useLoadedMap } from '@peripleo/maplibre';
import { GeoJSONSource, LngLatBoundsLike } from 'maplibre-gl';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import _ from 'underscore';

interface BoundingBoxOptions {
  padding: {
    top: number,
    bottom: number,
    left: number,
    right: number
  };
  maxZoom: number;
}

interface Feature {
  id: number;
  type: 'Feature';
  properties: any;
  geometry: any;
}

export const LayerTypes = {
  single: 'single',
  multiple: 'multiple'
};

interface SearchContextType {
  allowSave: boolean;
  boundingBoxOptions: BoundingBoxOptions;
  controlsClass?: string;
  features: Feature[];
  getBoundingBox(): Promise<LngLatBoundsLike>;
  layerType: typeof LayerTypes.single | typeof LayerTypes.multiple;
  setBoundingBoxOptions(boundingBoxOptions: BoundingBoxOptions): void;
  setControlsClass(controlsClass: string): void;
}

const MapSearchContext = createContext<SearchContextType>(null);

interface Props {
  allowSave?: boolean;
  children: ReactNode;
  preload?: boolean;
}

export const MapSearchContextProvider = ({ allowSave, children, preload }: Props) => {
  const [boundingBoxOptions, setBoundingBoxOptions] = useState<BoundingBoxOptions>();
  const [controlsClass, setControlsClass] = useState<string>();
  const [features, setFeatures] = useState([]);
  const [geometryCache, setGeometryCache] = useState({});
  const [geometries, setGeometries] = useState({});

  const config = useSearchConfig();
  const hits = useCachedHits();
  const map = useLoadedMap();

  /**
   * Returns a promise that resolves the bounding box for all visible features.
   */
  const getBoundingBox = useCallback(() => new Promise<LngLatBoundsLike>((resolve) => {
    if (!map) {
      return;
    }

    const promises = [];

    _.each(features, (feature) => {
      if (feature.properties.visible) {
        const id = feature.properties.uuid;
        const source = map.getSource(`source-${id}`) as unknown as GeoJSONSource;

        const cached = geometryCache[id];

        /**
         * In order to calculate the bounding box for multiple layers, we'll need to get the GeoJSON data
         * for all layers. We can do this using the `source.getData()` async function, but this incurs a
         * performance penalty. As a result, we do not want to do this each time we're calculating the
         * bounding box. Instead, we'll call source.getData() exactly once per layer and cache results.
         */
        if (cached) {
          promises.push(Promise.resolve(cached));
        } else if (!preload) {
          promises.push(Promise.resolve(feature));
        } else {
          promises.push(source.getData());
        }
      }
    });

    Promise.all(promises)
      .then((data) => {
        // Set the fetched data in the geometry cache
        setGeometryCache((prevCache) => ({
          ...prevCache,
          ..._.indexBy(data, (d) => d.properties.uuid)
        }));

        // Calculate the bounding box
        const featureCollection = MapUtils.toFeatureCollection(data);
        const bbox = MapUtils.getBoundingBox(featureCollection);

        resolve(bbox);
      });
  }), [features, geometryCache, map, preload]);

  /**
   * Memo-izes the layer type based on whether or not the map is preloaded.
   */
  const layerType = useMemo(() => preload ? LayerTypes.multiple : LayerTypes.single, [preload]);

  /**
   * Updates the set of features when the geometries or hits are changed.
   */
  useEffect(() => {
    const options = {};

    if (config.map.cluster_radius) {
      _.extend(options, { type: 'Point' });
    }

    if (preload) {
      _.extend(options, { geometries });
    }

    setFeatures(TypesenseUtils.getFeatures(features, hits, config.map.geometry, options));
  }, [geometries, hits]);

  /**
   * Fetches the current page of geometry records.
   */
  useEffect(() => {
    if (!preload) {
      return;
    }

    fetchGeometries()
      .then((data) => _.indexBy(data, 'id'))
      .then(setGeometries);
  }, []);

  return (
    <MapSearchContext.Provider
      value={{
        allowSave,
        boundingBoxOptions,
        controlsClass,
        features,
        getBoundingBox,
        layerType,
        setBoundingBoxOptions,
        setControlsClass
      }}
    >
      { children }
    </MapSearchContext.Provider>
  )
};

export default MapSearchContext;