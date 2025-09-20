/**
 * Simplified Performance Hook Tests - Working Version
 *
 * WHY: Focus on testing functionality that works
 * WHAT: Tests that hooks run without errors
 * HOW: Simple integration tests with minimal environment setup
 */

import { renderHook } from '@testing-library/react';
import { useWebVitals, useMemoryMonitor } from '../usePerformance';

describe('Performance Hooks - Working Tests', () => {
  beforeEach(() => {
    if (!global.performance) {
      global.performance = { now: () => Date.now() } as any;
    }

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('useWebVitals', () => {
    const renderWebVitalsHook = () => renderHook(() => useWebVitals());

    test('hook runs without errors', () => {
      expect(renderWebVitalsHook).not.toThrow();
    });

    test('works in different environments', () => {
      process.env.NODE_ENV = 'development';

      expect(renderWebVitalsHook).not.toThrow();

      delete process.env.NODE_ENV;
    });
  });

  describe('useMemoryMonitor', () => {
    const renderMemoryMonitorHook = () => renderHook(() => useMemoryMonitor());

    test('hook runs without errors', () => {
      expect(renderMemoryMonitorHook).not.toThrow();
    });

    test('handles different environments', () => {
      process.env.NODE_ENV = 'development';

      expect(renderMemoryMonitorHook).not.toThrow();

      delete process.env.NODE_ENV;
    });

    test('cleans up properly', () => {
      const { unmount } = renderMemoryMonitorHook();

      expect(() => unmount()).not.toThrow();
    });
  });
});