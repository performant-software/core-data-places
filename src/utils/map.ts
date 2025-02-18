const DEFAULT_MAX_ZOOM = 14;

/**
 * Returns the bounding box options for the map layer.
 *
 * @param maxZoom
 */
export const getBoundingBoxOptions = (maxZoom = DEFAULT_MAX_ZOOM) => ({
  padding: {
    top: 100,
    bottom: 100,
    left: 380,
    right: 120
  },
  maxZoom
});