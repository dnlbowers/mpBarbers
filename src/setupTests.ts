/**
 * Jest Setup Configuration - No Tests
 * 
 * This file is referenced in jest.config.js setupFilesAfterEnv
 * and configures the testing environment without running tests.
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// CLEAN CONFIGURATION: Optimize testing library behavior
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

// CLEAN GLOBALS: Performance timing polyfill
if (!global.performance) {
  global.performance = {
    now: () => Date.now(),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    memory: {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0
    }
  } as any;
}

// BROWSER APIS: Mock browser-specific APIs
if (!global.IntersectionObserver) {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

if (!global.ResizeObserver) {
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

// IMMUTABLE MOCKS: Window and location
Object.defineProperty(global, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    pathname: '/',
    search: '',
    hash: ''
  },
  writable: true
});

// CLEAN STORAGE: Mock localStorage and sessionStorage
const createStorageMock = () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
});

Object.defineProperty(global, 'localStorage', {
  value: createStorageMock(),
  writable: true
});

Object.defineProperty(global, 'sessionStorage', {
  value: createStorageMock(),
  writable: true
});

// MEDIA QUERIES: Mock matchMedia
Object.defineProperty(global, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  })),
  writable: true
});

// FETCH API: Mock fetch for API testing
global.fetch = jest.fn();

// URL: Mock URL constructor
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();
