import Tooltip from '@apps/search/map/Tooltip';
import { useSearchConfig } from '@apps/search/SearchConfigContext';
import { SearchResultsLayer } from '@performant-software/core-data';
import { Map as MapUtils } from '@performant-software/geospatial';
import { HoverTooltip } from '@peripleo/maplibre';
import { useMemo } from 'react';
import _ from 'underscore';

const SingleLayer = (props) => {
  const config = useSearchConfig();

  /**
   * Memo-izes the data to only include features that are visible.
   */
  const data = useMemo(() => MapUtils.toFeatureCollection(
    _.filter(props.data, (d) => d.properties.visible)
  ), [props.data]);

  return (
    <>
      <SearchResultsLayer
        data={data}
        cluster={!!config.map.cluster_radius}
        clusterRadius={config.map.cluster_radius}
        fitBoundingBox={false}
        interactive
      />
      <HoverTooltip
        tooltip={({ hovered }) => (
          <Tooltip
            hovered={hovered}
          />
        )}
      />
    </>
  );
};

export default SingleLayer;