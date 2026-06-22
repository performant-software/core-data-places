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
      if (prevFeature) {
        map.setFeatureState({ source: 'source-markers', id: prevFeature.id }, { selected: false });
        setPrevFeature(null);
      }
      return;
    }

    const feature = mapData?.features.find(f => f.properties?.uuid === placeUuid);

    if (!feature) {
      return
    }

    if (prevFeature) {
      map.setFeatureState({ source: 'source-markers', id: prevFeature.id }, { selected: false });
    }

    map.setFeatureState({ source: 'source-markers', id: feature.id }, { selected: true });
    setPrevFeature(feature);
  }, [placeUuid, mapData, map]);

  return null;
};

export default PathSelectionManager;
