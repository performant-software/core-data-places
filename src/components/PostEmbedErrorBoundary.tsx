import React, { type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /**
   * When any value in this array changes (compared positionally with
   * `Object.is`), a boundary that is currently showing its fallback resets and
   * re-renders its children, and the auto-retry budget is replenished. Pass
   * something derived from the rendered content (e.g. the post body) so the
   * preview recovers on the next edit even if auto-retry was exhausted.
   */
  resetKeys?: ReadonlyArray<unknown>;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  resetKeys: ReadonlyArray<unknown>;
  retryCount: number;
}

/**
 * Most embed crashes are one-shot teardown throws from children that are already
 * unmounted (see class comment), so an automatic retry restores the preview.
 * Removing one map can throw several times in a single synchronous burst (the
 * removed map plus index-keyed siblings that remount), so the retry is deferred
 * and de-duplicated — one retry per burst, after the burst settles. The cap
 * counts bursts, not individual throws, so a genuine render-phase error (one
 * that throws on every render) can only retry a few times before we leave the
 * fallback up — rather than letting React escalate repeated failures into a root
 * unmount, which would tear down the editor and lose unsaved edits.
 */
const MAX_AUTO_RETRIES = 3;

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
 *
 * On catch it auto-retries once (see `MAX_AUTO_RETRIES`) so the preview heals
 * itself after a one-shot teardown throw instead of stranding the editor on the
 * fallback until the next keystroke.
 */
class PostEmbedErrorBoundary extends React.Component<Props, State> {
  // Pending deferred retry; held so a burst of throws schedules only one retry
  // and so the timer can be cleared if we unmount first.
  private retryTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, resetKeys: props.resetKeys ?? [], retryCount: 0 };
  }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    const changed = resetKeysChanged(props.resetKeys, state.resetKeys);

    if (state.hasError && changed) {
      return { hasError: false, resetKeys: props.resetKeys ?? [], retryCount: 0 };
    }

    if (changed) {
      // New content: clear the error state already handled above; replenish the
      // retry budget so a later, unrelated crash gets its own attempt.
      return { resetKeys: props.resetKeys ?? [], retryCount: 0 };
    }

    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep the throw visible; the boundary only suppresses the crash, not the signal.
    console.error('Post embed crashed; contained to keep the editor alive.', error, info);
    this.props.onError?.(error, info);
    this.scheduleRetry();
  }

  componentWillUnmount() {
    if (this.retryTimer !== undefined) {
      clearTimeout(this.retryTimer);
    }
  }

  /**
   * Schedules a single deferred retry per burst. Deferring to a macrotask lets a
   * whole cascade of teardown throws settle first, so the retry re-renders once
   * against the already-corrected content and succeeds. Re-rendering only reads
   * the current (already-edited) content — it never touches form state — so
   * edits are never lost. The cap bounds a genuine render-phase loop.
   */
  private scheduleRetry() {
    if (this.retryTimer !== undefined || this.state.retryCount >= MAX_AUTO_RETRIES) {
      return;
    }

    this.retryTimer = setTimeout(() => {
      this.retryTimer = undefined;
      this.setState((state) => ({ hasError: false, retryCount: state.retryCount + 1 }));
    }, 0);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}

export default PostEmbedErrorBoundary;
