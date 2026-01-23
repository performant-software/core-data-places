import { fetchGeometry, fetchGeometryCount } from '@backend/api/geometry';
import { getPages } from '@utils/list';
import {
  createContext,
  useEffect,
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

interface Geometry {
  [uuid: string]: {
    uuid: string;
    geometry: any;
  }
}

interface SearchContextType {
  allowSave: boolean;
  boundingBoxOptions: BoundingBoxOptions;
  controlsClass?: string;
  geometries?: Geometry;
  isPreloaded?: boolean;
  setBoundingBoxOptions(boundingBoxOptions: BoundingBoxOptions): void;
  setControlsClass(controlsClass: string): void;
}

const MapSearchContext = createContext<SearchContextType>(null);

interface Props {
  allowSave?: boolean;
  children: ReactNode;
}

const PER_PAGE = 20;

export const MapSearchContextProvider = ({ allowSave, children }: Props) => {
  const [boundingBoxOptions, setBoundingBoxOptions] = useState<BoundingBoxOptions>();
  const [controlsClass, setControlsClass] = useState<string>();
  const [geometries, setGeometries] = useState({});
  const [geometryCount, setGeometryCount] = useState<number>(0);
  const [page, setPage] = useState<number | undefined>();

  const isPreloaded = import.meta.env.PUBLIC_PRELOAD_MAP;

  /**
   * Fetches the count of geometry records.
   */
  useEffect(() => {
    fetchGeometryCount()
      .then(setGeometryCount)
      .finally(() => setPage(1));
  }, []);

  /**
   * Fetches the current page of geometry records.
   */
  useEffect(() => {
    const pages = getPages(geometryCount, PER_PAGE);

    if (!page || page > pages) {
      return;
    }

    fetchGeometry(page)
      .then((data) => _.indexBy(data, 'uuid'))
      .then((data) => setGeometries((prevGeometries) => ({ ...prevGeometries, ...data })))
      .then(() => setPage((prevPage) => prevPage + 1));
  }, [page]);

  return (
    <MapSearchContext.Provider
      value={{
        allowSave,
        boundingBoxOptions,
        controlsClass,
        geometries,
        isPreloaded,
        setBoundingBoxOptions,
        setControlsClass
      }}
    >
      { children }
    </MapSearchContext.Provider>
  )
};

export default MapSearchContext;