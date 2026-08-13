/**
 * Parses a JSON string from a TinaCMS rich-text embed's `data` attribute.
 *
 * Returns `null` for empty input and also for any JSON.parse error. A render-
 * side parse failure indicates corrupted data — typically from MDX attribute
 * round-trip artifacts (e.g. literal `&quot;` strings in highlight snippets
 * being decoded to unescaped `"`). The visualization components gate their
 * render on a truthy result, so returning `null` renders nothing instead of
 * propagating an uncaught exception that would crash the editor iframe.
 */
export const parseVisualizationData = (data: string | null | undefined): any => {
  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (err) {
    console.error('Visualization data failed to parse; embed will not render.', err);
    return null;
  }
};
