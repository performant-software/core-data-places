import Map from '@components/Map';
import { Typesense as TypesenseUtils } from '@performant-software/core-data';
import { LocationMarkers } from '@performant-software/geospatial';
import { useRuntimeConfig } from '@peripleo/peripleo';
import React, { useMemo } from 'react';

interface Props {
  data: any;
  title: string;
}

const MapEmbed = (props: Props) => {
  const config = useRuntimeConfig<any>();

  const hits = useMemo(() => JSON.parse(props.data), [props.data]);
  const data = useMemo(() => TypesenseUtils.toFeatureCollection(hits, config.map.geometry), [config, hits]);

  return (
    <>
      <h3>
        { props.title }
      </h3>
      <div
        className='h-[400px]'
      >
        <Map>
          <LocationMarkers
            data={data}
          />
        </Map>
      </div>
    </>
  );
};

export default MapEmbed;