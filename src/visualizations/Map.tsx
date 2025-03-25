import BaseMap from '@components/Map';
import VisualizationContainer from '@components/VisualizationContainer';
import { Typesense as TypesenseUtils } from '@performant-software/core-data';
import { LocationMarkers } from '@performant-software/geospatial';
import { useRuntimeConfig } from '@peripleo/peripleo';
import type { DataVisualizationProps } from '@types';
import React, { useMemo } from 'react';

const Map = (props: DataVisualizationProps) => {
  const config = useRuntimeConfig<any>(); // TODO: Fix me; Embed collection name in uploaded data

  /**
   * Memo-izes the "data" prop as JSON.
   */
  const records = useMemo(() => JSON.parse(props.data), [props.data]);

  /**
   * Memo-izes the data as a feature collection.
   */
  const data = useMemo(() => TypesenseUtils.toFeatureCollection(records, config.map.geometry), [config, records]);

  return (
    <VisualizationContainer
      title={props.title}
    >
      <div
        className='h-[400px]'
      >
        <BaseMap>
          <LocationMarkers
            data={data}
          />
        </BaseMap>
      </div>
    </VisualizationContainer>
  );
};

export default Map;