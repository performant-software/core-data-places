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

  if (!props.data) {
    return null;
  }

  const runtimeConfig = useRuntimeConfig<Configuration>();

  /**
   * Memo-izes the "data" prop as JSON.
   */
  const parsed = useMemo(() => props.data ? JSON.parse(props.data) : null, [props.data]);

  /**
   * Memo-izes the search config based on the data set.
   */
  const config = useMemo(() => parsed ? _.findWhere(runtimeConfig.search, { name: parsed.name }) : null, [parsed, runtimeConfig]);

  /**
   * Builds features from Typesense hits when available — mirrors the live search
   * page. Falls back to fetching geometry per feature only when hits are absent
   * (legacy saved sessions on deployments that preload the geometry collection).
   */
  useEffect(() => {
    if (!parsed?.data) {
      return;
    }

    const { hits, features } = parsed.data;

    if (hits && config?.map) {
      const { geometry, properties } = config.map;
      setFeatures(TypesenseUtils.getFeatures([], hits, geometry, properties));
      return;
    }

    if (features) {
      const promises = _.map(features, ({ properties }) => (
        fetchGeometry(properties.uuid)
          .then((data) => ({ data, properties }))
      ));

      Promise.all(promises)
        .then((values) => (
          setFeatures(_.map(values, ({ data, properties }) => _.extend(data, { properties })))
        ));
    }
  }, [parsed, config]);

  return parsed && (
    <VisualizationContainer
      title={props.title}
    >
      <div
        className='h-[400px]'
      >
        { features && (
          <BaseMap>
            <LocationMarkers
              boundingBoxOptions={{ padding: 20 }}
              data={MapUtils.toFeatureCollection(features)}
            />
          </BaseMap> 
        )}
      </div>
    </VisualizationContainer>
  );
};

export default Map;