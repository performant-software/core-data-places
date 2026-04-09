import { Map as MapUtils } from '@performant-software/geospatial';
import { useMemo } from 'react';
import { GeoJSONLayer } from '@peripleo/maplibre';

interface Props {
  data: any[];
  getProperties: (item: any) => any;
}

const CertaintyLayer = (props: Props) => {
  const circles = useMemo(() => MapUtils.getCertaintyCircles(
    props.data,
    props.getProperties
  ), [props.data, props.getProperties]);

  return (
    <GeoJSONLayer
      id='uncertaintyRadius'
      data={circles}
    />
  );
}

export default CertaintyLayer;
