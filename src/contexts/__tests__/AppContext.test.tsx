/**
 * App Context Test Suite
 *
 * @description Comprehensive tests for application context including state management,
 * action dispatching, form data persistence, and provider integration.
 * Ensures reliable global state management throughout the application.
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from '../AppContext';
import { mockDataFactory } from '../../__tests__/testUtils';

// Wrapper component for testing hooks that require context
const createWrapper = () => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AppProvider>{children}</AppProvider>
  );
  return Wrapper;
};

// Helper functions to reduce nesting
const renderAppHook = () => renderHook(() => useApp(), { wrapper: createWrapper() });

const setActiveTabHelper = (result: any, tab: string) => {
  act(() => result.current.setActiveTab(tab));
};

const toggleMobileMenuHelper = (result: any) => {
  act(() => result.current.toggleMobileMenu());
};

const closeMobileMenuHelper = (result: any) => {
  act(() => result.current.closeMobileMenu());
};

const updateContactDataHelper = (result: any, data: any) => {
  act(() => result.current.updateContactData(data));
};

const resetContactDataHelper = (result: any) => {
  act(() => result.current.resetContactData());
};

const setLoadingHelper = (result: any, loading: boolean) => {
  act(() => result.current.setLoading(loading));
};

const setErrorHelper = (result: any, error: string | null) => {
  act(() => result.current.setError(error));
};

// Helper for testing hook without provider
const renderHookWithoutProvider = () => renderHook(() => useApp());

// Helper for console error suppression
const suppressConsoleError = (testFn: () => void) => {
  const originalConsoleError = console.error;
  console.error = jest.fn();
  testFn();
  console.error = originalConsoleError;
};

describe('App Context', () => {
  describe('useApp hook', () => {
    /**
     * Tests hook usage outside of provider
     * @description Ensures proper error handling when context is used incorrectly
     */
    test('throws error when used outside provider', () => {
      suppressConsoleError(() => {
        expect(renderHookWithoutProvider).toThrow('useApp must be used within an AppProvider');
      });
    });

    test('provides context value when used within provider', () => {
      const { result } = renderAppHook();

      expect(result.current.state).toBeDefined();
      expect(result.current.setActiveTab).toBeDefined();
      expect(result.current.toggleMobileMenu).toBeDefined();
      expect(result.current.closeMobileMenu).toBeDefined();
      expect(result.current.updateContactData).toBeDefined();
      expect(result.current.setLoading).toBeDefined();
      expect(result.current.setError).toBeDefined();
      expect(result.current.resetContactData).toBeDefined();
    });
  });

  describe('Initial State', () => {
    /**
     * Tests initial state configuration
     * @description Ensures proper default state values
     */
    test('has correct initial state', () => {
      const { result } = renderAppHook();

      expect(result.current.state.activeTab).toBe('home');
      expect(result.current.state.mobileMenuOpen).toBe(false);
      expect(result.current.state.loading).toBe(false);
      expect(result.current.state.error).toBe(null);

      // Contact data should be empty
      expect(result.current.state.contactData).toEqual({
        name: '',
        email: '',
        phoneNumber: '',
        message: '',
      });
    });
  });

  describe('Navigation Actions', () => {
    /**
     * Tests navigation state management
     * @description Ensures proper navigation state updates and mobile menu behavior
     */
    test('setActiveTab updates active tab', () => {
      const { result } = renderAppHook();

      setActiveTabHelper(result, 'services');

      expect(result.current.state.activeTab).toBe('services');
    });

    test('setActiveTab closes mobile menu', () => {
      const { result } = renderAppHook();

      // First open mobile menu
      toggleMobileMenuHelper(result);

      expect(result.current.state.mobileMenuOpen).toBe(true);

      // Then navigate to new tab
      setActiveTabHelper(result, 'about');

      expect(result.current.state.activeTab).toBe('about');
      expect(result.current.state.mobileMenuOpen).toBe(false);
    });

    test('toggleMobileMenu changes menu state', () => {
      const { result } = renderAppHook();

      expect(result.current.state.mobileMenuOpen).toBe(false);

      toggleMobileMenuHelper(result);

      expect(result.current.state.mobileMenuOpen).toBe(true);

      toggleMobileMenuHelper(result);

      expect(result.current.state.mobileMenuOpen).toBe(false);
    });

    test('closeMobileMenu closes menu', () => {
      const { result } = renderAppHook();

      // First open menu
      toggleMobileMenuHelper(result);

      expect(result.current.state.mobileMenuOpen).toBe(true);

      // Then close explicitly
      closeMobileMenuHelper(result);

      expect(result.current.state.mobileMenuOpen).toBe(false);
    });
  });

  describe('Contact Data Management', () => {
    /**
     * Tests contact form data persistence and updates
     * @description Ensures proper contact form state management across navigation
     */
    test('updateContactData merges partial data', () => {
      const { result } = renderAppHook();

      updateContactDataHelper(result, {
        name: 'John Doe',
        email: 'john@example.com',
      });

      expect(result.current.state.contactData.name).toBe('John Doe');
      expect(result.current.state.contactData.email).toBe('john@example.com');
      expect(result.current.state.contactData.message).toBe(''); // Should remain empty
    });

    test('updateContactData preserves existing data', () => {
      const { result } = renderAppHook();

      // First update
      updateContactDataHelper(result, {
        name: 'John Doe',
        email: 'john@example.com',
      });

      // Second update
      updateContactDataHelper(result, {
        message: 'Hello world',
      });

      expect(result.current.state.contactData.name).toBe('John Doe');
      expect(result.current.state.contactData.email).toBe('john@example.com');
      expect(result.current.state.contactData.message).toBe('Hello world');
    });

    test('resetContactData clears all contact data', () => {
      const { result } = renderAppHook();

      // First populate data
      updateContactDataHelper(result, mockDataFactory.contactFormData());

      expect(result.current.state.contactData.name).toBe('Jane Smith');
      expect(result.current.state.contactData.email).toBe('jane.smith@example.com');

      // Then reset
      resetContactDataHelper(result);

      expect(result.current.state.contactData).toEqual({
        name: '',
        email: '',
        phoneNumber: '',
        message: '',
      });
    });
  });

  describe('Loading and Error States', () => {
    /**
     * Tests loading and error state management
     * @description Ensures proper async operation state handling
     */
    test('setLoading updates loading state', () => {
      const { result } = renderAppHook();

      setLoadingHelper(result, true);

      expect(result.current.state.loading).toBe(true);

      setLoadingHelper(result, false);

      expect(result.current.state.loading).toBe(false);
    });

    test('setError updates error state and clears loading', () => {
      const { result } = renderAppHook();

      // First set loading
      setLoadingHelper(result, true);

      expect(result.current.state.loading).toBe(true);

      // Then set error
      setErrorHelper(result, 'Test error message');

      expect(result.current.state.error).toBe('Test error message');
      expect(result.current.state.loading).toBe(false); // Should be cleared
    });

    test('setError can clear error state', () => {
      const { result } = renderAppHook();

      // First set error
      setErrorHelper(result, 'Test error');

      expect(result.current.state.error).toBe('Test error');

      // Then clear error
      setErrorHelper(result, null);

      expect(result.current.state.error).toBe(null);
    });
  });

  describe('State Immutability', () => {
    /**
     * Tests state immutability patterns
     * @description Ensures state updates follow immutable patterns
     */
    test('state updates create new objects', () => {
      const { result } = renderAppHook();

      const originalState = result.current.state;
      const originalContactData = result.current.state.contactData;

      updateContactDataHelper(result, { name: 'John Doe' });

      // State should be a new object
      expect(result.current.state).not.toBe(originalState);

      // Contact data should be a new object
      expect(result.current.state.contactData).not.toBe(originalContactData);

      // But the structure should be maintained
      expect(result.current.state.contactData.name).toBe('John Doe');
    });
  });
});
