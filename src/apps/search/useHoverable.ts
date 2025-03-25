import { useSearchConfig } from '@apps/search/SearchContext';
import { Typesense as TypesenseUtils } from '@performant-software/core-data';
import { useHoverState } from '@peripleo/peripleo';
import { parseFeature } from '@utils/map';
import { useCallback, useMemo } from 'react';
import _ from 'underscore';

const useHoverable = () => {
  const config = useSearchConfig();
  const { hover, setHover } = useHoverState();

  const feature = useMemo(() => parseFeature(hover), [hover]);

  /**
   * Returns true if the passed hit is currently hovered.
   */
  const isHover = useCallback((hit) => _.some(feature?.properties?.items, (item) => hit.uuid === item.uuid), [feature]);

  /**
   * Sets the hover element on the state.
   */
  const onHoverChange = useCallback((nextHover: any) => (
    setHover((prevHover) => (prevHover?.id === nextHover?.id ? prevHover : nextHover))
  ), []);

  /**
   * Callback fired when the pointer enters the container.
   */
  const onPointEnter = useCallback((hit) => {
    if (onHoverChange && hover?.id !== hit.id) {
      const { features } = TypesenseUtils.toFeatureCollection([hit], config.map.geometry);
      onHoverChange(_.first(features));
    }
  }, [hover, onHoverChange]);

  /**
   * Callback fired when the pointer leaves the container.
   */
  const onPointLeave = useCallback(() => {
    if (onHoverChange) {
      onHoverChange(undefined);
    }
  }, [hover, onHoverChange]);

  return {
    isHover,
    onPointEnter,
    onPointLeave
  };
};

export default useHoverable;