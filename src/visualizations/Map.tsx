import { fetchGeometry } from '@backend/api/geometry';
import BaseMap from '@components/Map';
import VisualizationContainer from '@components/VisualizationContainer';
import { Typesense as TypesenseUtils } from '@performant-software/core-data';
import { LocationMarkers, Map as MapUtils } from '@performant-software/geospatial';
import { useRuntimeConfig } from '@peripleo/peripleo';
import type { Configuration, DataVisualizationProps } from '@types';
import React, { useEffect, useMemo, useState } from 'react';
import _ from 'underscore';

const Map = (props: DataVisualizationProps) => {
  const [features, setFeatures] = useState([]);

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
   * If the data set contains the features data, fetch the geometry for each.
   */
  useEffect(() => {
    if (parsed.data.features) {
      const promises = _.map(parsed.data.features, ({ properties }) => (
        fetchGeometry(properties.uuid)
          .then((data) => ({ data, properties }))
      ));

      Promise.all(promises)
        .then((values) => (
          setFeatures(_.map(values, ({ data, properties }) => _.extend(data, { properties })))
        ));
    }
  }, [parsed]);

  /**
   * If the data set does not contain the features data, pull the geometry directly off the hits.
   */
  useEffect(() => {
    if (!parsed.data.features) {
      const { hits } = parsed.data;
      const { geometry } = config.map;

      setFeatures(TypesenseUtils.getFeatures([], hits, geometry));
    }
  }, [parsed]);

  return (
    <VisualizationContainer
      title={props.title}
    >
      <div
        className='h-[400px]'
      >
        <BaseMap>
          <LocationMarkers
            boundingBoxOptions={{ padding: 20 }}
            data={MapUtils.toFeatureCollection(features)}
          />
        </BaseMap>
      </div>
    </VisualizationContainer>
  );
};

export default Map;