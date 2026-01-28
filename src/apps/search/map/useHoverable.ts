import MapSearchContext from '@apps/search/map/MapSearchContext';
import { Typesense as TypesenseUtils } from '@performant-software/core-data';
import { useHoverState } from '@peripleo/maplibre';
import { useCallback, useContext, useMemo } from 'react';
import _ from 'underscore';
import { useSearchConfig } from '@apps/search/SearchConfigContext';

const useHoverable = () => {
  const config = useSearchConfig();
  const { hover, setHover } = useHoverState();
  const { features } = useContext(MapSearchContext);

  const { hovered } = hover || {};

  /**
   * Memo-izes the feature representing the hovered item.
   */
  const feature = useMemo(() => (
    _.find(features, (feature) => feature.properties.uuid === hovered?.properties?.uuid)
  ), [features, hovered]);

  /**
   * Returns true if the passed hit is currently hovered.
   */
  const isHover = useCallback((hit) => _.some(feature?.properties?.items, (item) => hit.uuid === item.uuid), [feature]);

  /**
   * Sets the hover element on the state.
   */
  const onHoverChange = useCallback((nextHovers: any) => {
    if (nextHovers) {
      setHover({ hovered: nextHovers });
    } else {
      setHover(undefined);
    }
  }, [setHover]);

  /**
   * Callback fired when the pointer enters the container.
   */
  const onPointEnter = useCallback((hit) => {
    if (onHoverChange && hovered?.id !== hit.id) {
      onHoverChange(TypesenseUtils.getFeatures([], [hit], config.map.geometry, {}));
    }
  }, [config, hovered, onHoverChange]);

  /**
   * Callback fired when the pointer leaves the container.
   */
  const onPointLeave = useCallback(() => {
    if (onHoverChange) {
      onHoverChange(undefined);
    }
  }, [onHoverChange]);

  return {
    isHover,
    onPointEnter,
    onPointLeave
  };
};

export default useHoverable;