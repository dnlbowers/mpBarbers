/**
 * Modern Test Setup for React 18 + Testing Library
 *
 * Configures testing environment with accessibility and performance focus.
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
  getElementError: (message, container) => {
    const error = new Error(
      `${message}\n\nHTML:\n${container?.innerHTML || 'No container'}`
    );
    error.name = 'TestingLibraryElementError';
    return error;
  }
});

/**
 * Runs automated accessibility validation using axe-core to ensure
 * all components meet accessibility standards.
 *
 * @param container - DOM element to test for accessibility violations
 */
export const runAxeTest = async (container: Element): Promise<void> => {
  expect(container).toBeInTheDocument();

  const { axe, toHaveNoViolations } = await import('jest-axe');
  expect.extend(toHaveNoViolations);

  const results = await axe(container);
  expect(results).toHaveNoViolations();
};

/**
 * Measures render times for performance testing.
 *
 * @param renderFn - Function to measure execution time
 * @returns Execution time in milliseconds
 */
export const measureRenderTime = (renderFn: () => void): number => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

describe('Test Setup', () => {
  test('setup file loads correctly', () => {
    expect(true).toBe(true);
  });

  test('jest-dom matchers are available', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    expect(div).toBeInTheDocument();
    document.body.removeChild(div);
  });
});