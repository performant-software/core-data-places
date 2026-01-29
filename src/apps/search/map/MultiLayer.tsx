import { useSearchConfig } from '@apps/search/SearchConfigContext';
import Tooltip from '@apps/search/map/Tooltip';
import { SearchResultsLayer } from '@performant-software/core-data';
import { HoverTooltip } from '@peripleo/maplibre';
import _ from 'underscore';

const MultiLayer = (props) => {
  const config = useSearchConfig();

  return _.map(props.data, (feature) => (
    <>
      <SearchResultsLayer
        data={feature.properties.url}
        cluster={!!config.map.cluster_radius}
        clusterRadius={config.map.cluster_radius}
        fitBoundingBox={false}
        interactive
        key={`layer-${feature.properties.uuid}`}
        layerId={feature.properties.uuid}
        visible={feature.properties.visible}
      />
      <HoverTooltip
        key={`hover-${feature.properties.uuid}`}
        layerId={[
          `layer-${feature.properties.uuid}-fill`,
          `layer-${feature.properties.uuid}-line`,
          `layer-${feature.properties.uuid}-point`,
        ]}
        tooltip={({ hovered }) => (
          <Tooltip
            feature={feature}
            hovered={hovered}
          />
        )}
      />
    </>
  ));
};

export default MultiLayer;