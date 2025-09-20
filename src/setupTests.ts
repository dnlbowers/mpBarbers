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
    constructor(callback: any, options?: any) {
      // Mock constructor with minimal implementation
      if (callback && options) {
        // Parameters are acknowledged but not used in mock
      }
    }
    observe(_target: Element): void {
      // Mock observe - no implementation needed for tests
    }
    unobserve(_target: Element): void {
      // Mock unobserve - no implementation needed for tests
    }
    disconnect(): void {
      // Mock disconnect - no implementation needed for tests
    }
  } as any;
}

if (!global.ResizeObserver) {
  global.ResizeObserver = class ResizeObserver {
    constructor(callback: any) {
      // Mock constructor with minimal implementation
      if (callback) {
        // Parameter is acknowledged but not used in mock
      }
    }
    observe(_target: Element, _options?: any): void {
      // Mock observe - no implementation needed for tests
    }
    unobserve(_target: Element): void {
      // Mock unobserve - no implementation needed for tests
    }
    disconnect(): void {
      // Mock disconnect - no implementation needed for tests
    }
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

// WINDOW METHODS: Mock window methods for testing
Object.defineProperty(global, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

// URL: Mock URL constructor
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// DIALOG ELEMENT: Mock HTMLDialogElement for modal tests
Object.defineProperty(global, 'HTMLDialogElement', {
  value: class HTMLDialogElement {
    open: boolean = false;
    returnValue: string = '';

    constructor() {
      this.open = false;
      this.returnValue = '';
    }

    showModal() {
      this.open = true;
    }

    show() {
      this.open = true;
    }

    close(returnValue?: string) {
      this.open = false;
      if (returnValue !== undefined) {
        this.returnValue = returnValue;
      }
    }

    addEventListener(_type: string, _listener: EventListener): void {
      // Mock addEventListener - no implementation needed for tests
    }
    removeEventListener(_type: string, _listener: EventListener): void {
      // Mock removeEventListener - no implementation needed for tests
    }
    dispatchEvent(_event: Event): boolean {
      return true;
    }
  },
  writable: true,
  configurable: true
});
