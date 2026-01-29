import MapSearchContext from '@apps/search/map/MapSearchContext';
import { useSearchConfig } from '@apps/search/SearchConfigContext';
import { useHoverState } from '@peripleo/maplibre';
import {
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import _ from 'underscore';

const useHoverable = () => {
  const [hoverHit, setHoverHit] = useState();

  const config = useSearchConfig();
  const { hover, setHover } = useHoverState();
  const { features, getGeometry } = useContext(MapSearchContext);

  const { hovered } = hover || {};

  /**
   * Memo-izes the feature representing the hovered item.
   */
  const feature = useMemo(() => (
    _.chain([hovered])
      .flatten()
      .compact()
      .map((h) => _.find(features, (f) => f.properties.uuid === h.properties.uuid))
      .first()
      .value()
  ), [features, hovered]);

  /**
   * Returns true if the passed hit is currently hovered.
   */
  const isHover = useCallback((hit) => {
    if (hoverHit) {
      return hoverHit.uuid === hit.uuid;
    }

    return _.some(feature?.properties?.items, (item) => hit.uuid === item.uuid)
  }, [feature, hoverHit]);

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
      const nextHovers = _.chain(features)
        .filter((feature) => _.some(feature.properties.items, (item) => item.uuid === hit.uuid))
        .map((feature) => getGeometry(feature.properties.uuid) || feature)
        .value();

      onHoverChange(nextHovers);
      setHoverHit(hit);
    }
  }, [config, getGeometry, hovered, onHoverChange]);

  /**
   * Callback fired when the pointer leaves the container.
   */
  const onPointLeave = useCallback(() => {
    if (onHoverChange) {
      onHoverChange(undefined);
      setHoverHit(undefined);
    }
  }, [onHoverChange]);

  return {
    isHover,
    onPointEnter,
    onPointLeave
  };
};

export default useHoverable;