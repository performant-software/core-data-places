import { useLoadedMap } from '@peripleo/maplibre';
import { useEffect, useState } from 'react';

interface Props {
  placeUuid?: string;
  mapData?: any;
}

const PathSelectionManager: React.FC<Props> = ({ placeUuid, mapData }) => {
  const map = useLoadedMap();
  const [prevFeature, setPrevFeature] = useState<any>(null);

  useEffect(() => {
    if (!placeUuid) {
      return;
    }

    const feature = mapData?.features.find(f => f.properties?.uuid === placeUuid);

    if (!feature) {
      return
    }

    const apply = () => {
      if (prevFeature) {
        map.setFeatureState({ source: 'source-markers', id: prevFeature.id }, { selected: false });
      }

      map.setFeatureState({ source: 'source-markers', id: feature.id }, { selected: true });
      setPrevFeature(feature);
    }

    if (map.loaded()) {
      apply();
    } else {
      map.once('idle', apply);
      return () => map.off('idle', apply);
    }
  }, [placeUuid, mapData, map]);

  return null;
};

export default PathSelectionManager;
