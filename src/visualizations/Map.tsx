import BaseMap from '@components/Map';
import VisualizationContainer from '@components/VisualizationContainer';
import { Typesense as TypesenseUtils } from '@performant-software/core-data';
import { LocationMarkers } from '@performant-software/geospatial';
import { useRuntimeConfig } from '@peripleo/peripleo';
import type { Configuration, DataVisualizationProps } from '@types';
import React, { useMemo } from 'react';
import _ from 'underscore';

const Map = (props: DataVisualizationProps) => {
  const runtimeConfig = useRuntimeConfig<Configuration>();

  /**
   * Memo-izes the "data" prop as JSON.
   */
  const parsed = useMemo(() => JSON.parse(props.data), [props.data]);

  /**
   * Memo-izes the search config based on the data set.
   */
  const config = useMemo(() => _.findWhere(runtimeConfig.search, { name: parsed.name }), [parsed, runtimeConfig]);

  /**
   * Memo-izes the data as a feature collection.
   */
  const data = useMemo(() => TypesenseUtils.toFeatureCollection(parsed.data, config.map.geometry), [config, parsed]);

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