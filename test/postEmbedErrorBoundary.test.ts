import { describe, expect, it } from 'vitest';
import PostEmbedErrorBoundary, { resetKeysChanged } from '../src/components/PostEmbedErrorBoundary';

describe('resetKeysChanged', () => {
  it('returns false for equal key arrays', () => {
    const body = { children: [] };
    expect(resetKeysChanged([body], [body])).toBe(false);
    expect(resetKeysChanged([], [])).toBe(false);
    expect(resetKeysChanged(['a', 1], ['a', 1])).toBe(false);
  });

  it('returns true when a positional value differs', () => {
    expect(resetKeysChanged([{ children: ['a'] }], [{ children: ['b'] }])).toBe(true);
    expect(resetKeysChanged(['a'], ['b'])).toBe(true);
  });

  it('returns true when the arrays differ in length', () => {
    expect(resetKeysChanged(['a'], ['a', 'b'])).toBe(true);
    expect(resetKeysChanged([], ['a'])).toBe(true);
  });

  it('treats missing arrays as empty', () => {
    expect(resetKeysChanged(undefined, undefined)).toBe(false);
    expect(resetKeysChanged(undefined, ['a'])).toBe(true);
    expect(resetKeysChanged(['a'], undefined)).toBe(true);
  });

  it('compares with Object.is (same reference is unchanged)', () => {
    const ref = {};
    expect(resetKeysChanged([ref], [ref])).toBe(false);
    expect(resetKeysChanged([{}], [{}])).toBe(true);
  });
});

describe('PostEmbedErrorBoundary.getDerivedStateFromError', () => {
  it('flips into the error state so the fallback renders instead of the crash', () => {
    expect(PostEmbedErrorBoundary.getDerivedStateFromError()).toEqual({ hasError: true });
  });
});

describe('PostEmbedErrorBoundary.getDerivedStateFromProps', () => {
  const propsFor = (resetKeys: ReadonlyArray<unknown>) => ({ children: null, resetKeys });

  it('clears the error and adopts new keys when resetKeys change after a crash', () => {
    const next = ['v2'];
    const result = PostEmbedErrorBoundary.getDerivedStateFromProps(
      propsFor(next),
      { hasError: true, resetKeys: ['v1'] }
    );
    expect(result).toEqual({ hasError: false, resetKeys: next });
  });

  it('stays in the error state while resetKeys are unchanged', () => {
    const keys = ['v1'];
    const result = PostEmbedErrorBoundary.getDerivedStateFromProps(
      propsFor(keys),
      { hasError: true, resetKeys: keys }
    );
    expect(result).toBeNull();
  });

  it('tracks new keys without resetting when there is no error', () => {
    const next = ['v2'];
    const result = PostEmbedErrorBoundary.getDerivedStateFromProps(
      propsFor(next),
      { hasError: false, resetKeys: ['v1'] }
    );
    expect(result).toEqual({ resetKeys: next });
  });

  it('is a no-op when there is no error and keys are unchanged', () => {
    const keys = ['v1'];
    const result = PostEmbedErrorBoundary.getDerivedStateFromProps(
      propsFor(keys),
      { hasError: false, resetKeys: keys }
    );
    expect(result).toBeNull();
  });
});
