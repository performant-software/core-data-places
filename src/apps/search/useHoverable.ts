import { Typesense as TypesenseUtils } from '@performant-software/core-data';
import { useHoverState } from '@peripleo/peripleo';
import { useCallback } from 'react';

const useHoverable = () => {
  const { hover, setHover } = useHoverState();

  /**
   * Returns true if the passed hit is currently hovered.
   */
  const isHover = useCallback((hit) => hit.uuid === hover?.properties?.uuid, [hover]);

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
    if (onHoverChange) {
      onHoverChange(hover?.id === hit.id ? hover : TypesenseUtils.toFeature(hit));
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