import {
  createContext,
  useState,
  type ReactNode
} from 'react';

interface BoundingBoxOptions {
  padding: {
    top: number,
    bottom: number,
    left: number,
    right: number
  };
  maxZoom: number;
}

interface SearchContextType {
  allowSave: boolean;
  boundingBoxOptions: BoundingBoxOptions;
  setBoundingBoxOptions(boundingBoxOptions: BoundingBoxOptions): void;
  controlsClass?: string;
  setControlsClass(controlsClass: string): void;
}

const MapSearchContext = createContext<SearchContextType>(null);

interface Props {
  allowSave?: boolean;
  children: ReactNode;
  name: string;
}

export const MapSearchContextProvider = ({ allowSave, children, name }: Props) => {
  const [boundingBoxOptions, setBoundingBoxOptions] = useState<BoundingBoxOptions>();
  const [controlsClass, setControlsClass] = useState<string>();

  return (
    <MapSearchContext.Provider
      value={{
        allowSave,
        boundingBoxOptions,
        controlsClass,
        setBoundingBoxOptions,
        setControlsClass
      }}
    >
      { children }
    </MapSearchContext.Provider>
  )
};

export default MapSearchContext;