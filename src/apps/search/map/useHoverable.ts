import { Typesense as TypesenseUtils } from '@performant-software/core-data';
import { useHoverState } from '@peripleo/maplibre';
import { parseFeature } from '@utils/map';
import { useCallback, useMemo } from 'react';
import _ from 'underscore';
import { useSearchConfig } from "@apps/search/SearchConfigContext";

const useHoverable = () => {
  const config = useSearchConfig();
  const { hover, setHover } = useHoverState();

  const { hovered } = hover || {};
  const feature = useMemo(() => parseFeature(hovered), [hovered]);

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
      const { features } = TypesenseUtils.toFeatureCollection([hit], config.map.geometry);
      onHoverChange(features);
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