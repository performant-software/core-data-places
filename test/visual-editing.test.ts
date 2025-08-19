/**
 * Test script to verify TinaCMS visual editing configuration
 */

import { describe, it, expect } from 'vitest';

// Mock browser environment
global.window = {
  location: {
    search: '?__tina_edit=true',
    hostname: 'localhost',
    pathname: '/admin'
  }
} as any;

global.document = {
  documentElement: {
    classList: {
      add: () => {}
    }
  },
  head: {
    appendChild: () => {}
  },
  createElement: () => ({
    textContent: ''
  }),
  readyState: 'complete',
  addEventListener: () => {}
} as any;

// Import the utility after setting up mocks
import { isVisualEditingMode, initializeVisualEditing } from '../src/utils/visual-editing';

describe('Visual Editing Support', () => {
  it('should detect visual editing mode from URL parameter', () => {
    expect(isVisualEditingMode()).toBe(true);
  });

  it('should initialize visual editing without errors', () => {
    expect(() => initializeVisualEditing()).not.toThrow();
  });

  it('should handle missing window object gracefully', () => {
    const originalWindow = global.window;
    global.window = undefined as any;
    
    expect(isVisualEditingMode()).toBe(false);
    expect(() => initializeVisualEditing()).not.toThrow();
    
    global.window = originalWindow;
  });
});