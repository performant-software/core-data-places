import { useHoverState, useLoadedMap } from '@peripleo/maplibre';
import { useEffect } from 'react';

interface Props {
  placeUuid?: string;
  mapData?: any;
}

const PathHover: React.FC<Props> = ({ placeUuid, mapData }) => {
  const map = useLoadedMap();
  const { hover, setHover } = useHoverState();

  useEffect(() => {
    if (placeUuid) {
      const feature = mapData.features.find(f => f.properties?.uuid === placeUuid);
      if (feature) {
        const apply = () => setHover({ hovered: [feature] });

        if (map.loaded() && !map.isMoving()) {
          apply();
        } else {
          map.once('idle', apply);
        }
        return
      } else {
        setHover(undefined);
      }
    } else {
      setHover(undefined);

    }
  }, [placeUuid, mapData, map]);

  console.log(hover)

  return null;
};

export default PathHover;
