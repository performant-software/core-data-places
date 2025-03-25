import { useSearchConfig } from '@apps/search/SearchContext';
import { Typesense as TypesenseUtils } from '@performant-software/core-data';
import { useMapUtils } from '@peripleo/maplibre';
import { useHoverState } from '@peripleo/peripleo';
import { parseFeature } from '@utils/map';
import { useCallback, useMemo } from 'react';
import _ from 'underscore';

const useHoverable = () => {
  const config = useSearchConfig();
  const { hover, setHover } = useHoverState();
  const mapUtils = useMapUtils();

  const { hovered } = hover || {};
  const feature = useMemo(() => parseFeature(hovered), [hovered]);

  /**
   * Returns true if the passed hit is currently hovered.
   */
  const isHover = useCallback((hit) => _.some(feature?.properties?.items, (item) => hit.uuid === item.uuid), [feature]);

  /**
   * Sets the hover element on the state.
   */
  const onHoverChange = useCallback((nextHover: any) => {
    if (!nextHover) {
      setHover(undefined);
    } else if (nextHover && nextHover.id !== hovered?.id) {
      mapUtils
        .findMapFeature(nextHover.id)
        .then((mapFeature) => setHover({ hovered: nextHover, mapFeature }));
    }
  }, [hovered]);

  /**
   * Callback fired when the pointer enters the container.
   */
  const onPointEnter = useCallback((hit) => {
    if (onHoverChange && hovered?.id !== hit.id) {
      const { features } = TypesenseUtils.toFeatureCollection([hit], config.map.geometry);
      onHoverChange(_.first(features));
    }
  }, [hovered, onHoverChange]);

  /**
   * Callback fired when the pointer leaves the container.
   */
  const onPointLeave = useCallback(() => {
    if (onHoverChange) {
      onHoverChange(undefined);
    }
  }, [hovered, onHoverChange]);

  return {
    isHover,
    onPointEnter,
    onPointLeave
  };
};

export default useHoverable;