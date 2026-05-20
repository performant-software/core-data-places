import React, { type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /**
   * When any value in this array changes (compared positionally with
   * `Object.is`), a boundary that is currently showing its fallback resets and
   * re-renders its children. Pass something derived from the rendered content
   * (e.g. the post body) so the preview recovers on the next edit instead of
   * staying stuck on the fallback until a full reload.
   */
  resetKeys?: ReadonlyArray<unknown>;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  resetKeys: ReadonlyArray<unknown>;
}

/**
 * Returns true when two resetKeys arrays differ in length or in any positional
 * value (compared with `Object.is`).
 */
export const resetKeysChanged = (
  a: ReadonlyArray<unknown> = [],
  b: ReadonlyArray<unknown> = []
): boolean => a.length !== b.length || a.some((value, index) => !Object.is(value, b[index]));

/**
 * Contains render- and unmount-time crashes from post body embeds so a single
 * failing visualization can't take down the whole TinaCMS visual editor.
 *
 * The post body renders every embed (`<map>`, `<place>`, `<timeline>`, ...)
 * through `TinaMarkdown` inside a `client:only` island with no error handling.
 * Removing a map embed unmounts a MapLibre map whose layer/image children clean
 * up against an already-torn-down style (`map.removeImage` /
 * `map.getStyle().layers` read on an undefined style), throwing during React's
 * passive-effect unmount. With no boundary, React unmounts the entire root —
 * the editor preview and its visual-editing bridge go blank and unsaved edits
 * are lost. React routes commit-phase errors to the nearest *mounted* ancestor
 * boundary, so this must wrap the whole body (a boundary inside a removed block
 * is itself being deleted and can't catch its own teardown throw).
 */
class PostEmbedErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, resetKeys: props.resetKeys ?? [] };
  }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    const changed = resetKeysChanged(props.resetKeys, state.resetKeys);

    if (state.hasError && changed) {
      return { hasError: false, resetKeys: props.resetKeys ?? [] };
    }

    if (changed) {
      return { resetKeys: props.resetKeys ?? [] };
    }

    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep the throw visible; the boundary only suppresses the crash, not the signal.
    console.error('Post embed crashed; contained to keep the editor alive.', error, info);
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}

export default PostEmbedErrorBoundary;
