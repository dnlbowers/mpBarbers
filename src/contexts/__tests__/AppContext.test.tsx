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
import type { NavigationTab } from '../../types';

// Wrapper component for testing hooks that require context
const createWrapper = () => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AppProvider>{children}</AppProvider>
  );
  return Wrapper;
};

describe('App Context', () => {
  describe('useApp hook', () => {
    /**
     * Tests hook usage outside of provider
     * @description Ensures proper error handling when context is used incorrectly
     */
    test('throws error when used outside provider', () => {
      // Suppress console error for this test
      const originalConsoleError = console.error;
      console.error = jest.fn();

      expect(() => {
        renderHook(() => useApp());
      }).toThrow('useApp must be used within an AppProvider');

      // Restore console.error
      console.error = originalConsoleError;
    });

    test('provides context value when used within provider', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: createWrapper(),
      });

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
      const { result } = renderHook(() => useApp(), {
        wrapper: createWrapper(),
      });

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
      const { result } = renderHook(() => useApp(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setActiveTab('services');
      });

      expect(result.current.state.activeTab).toBe('services');
    });

    test('setActiveTab closes mobile menu', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: createWrapper(),
      });

      // First open mobile menu
      act(() => {
        result.current.toggleMobileMenu();
      });

      expect(result.current.state.mobileMenuOpen).toBe(true);

      // Then navigate to new tab
      act(() => {
        result.current.setActiveTab('about');
      });

      expect(result.current.state.activeTab).toBe('about');
      expect(result.current.state.mobileMenuOpen).toBe(false);
    });

    test('toggleMobileMenu changes menu state', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: createWrapper(),
      });

      expect(result.current.state.mobileMenuOpen).toBe(false);

      act(() => {
        result.current.toggleMobileMenu();
      });

      expect(result.current.state.mobileMenuOpen).toBe(true);

      act(() => {
        result.current.toggleMobileMenu();
      });

      expect(result.current.state.mobileMenuOpen).toBe(false);
    });

    test('closeMobileMenu closes menu', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: createWrapper(),
      });

      // First open menu
      act(() => {
        result.current.toggleMobileMenu();
      });

      expect(result.current.state.mobileMenuOpen).toBe(true);

      // Then close explicitly
      act(() => {
        result.current.closeMobileMenu();
      });

      expect(result.current.state.mobileMenuOpen).toBe(false);
    });
  });

  describe('Contact Data Management', () => {
    /**
     * Tests contact form data persistence and updates
     * @description Ensures proper contact form state management across navigation
     */
    test('updateContactData merges partial data', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.updateContactData({
          name: 'John Doe',
          email: 'john@example.com',
        });
      });

      expect(result.current.state.contactData.name).toBe('John Doe');
      expect(result.current.state.contactData.email).toBe('john@example.com');
      expect(result.current.state.contactData.message).toBe(''); // Should remain empty
    });

    test('updateContactData preserves existing data', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: createWrapper(),
      });

      // First update
      act(() => {
        result.current.updateContactData({
          name: 'John Doe',
          email: 'john@example.com',
        });
      });

      // Second update
      act(() => {
        result.current.updateContactData({
          message: 'Hello world',
        });
      });

      expect(result.current.state.contactData.name).toBe('John Doe');
      expect(result.current.state.contactData.email).toBe('john@example.com');
      expect(result.current.state.contactData.message).toBe('Hello world');
    });

    test('resetContactData clears all contact data', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: createWrapper(),
      });

      // First populate data
      act(() => {
        result.current.updateContactData(mockDataFactory.contactFormData());
      });

      expect(result.current.state.contactData.name).toBe('Jane Smith');
      expect(result.current.state.contactData.email).toBe('jane.smith@example.com');

      // Then reset
      act(() => {
        result.current.resetContactData();
      });

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
      const { result } = renderHook(() => useApp(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.state.loading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.state.loading).toBe(false);
    });

    test('setError updates error state and clears loading', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: createWrapper(),
      });

      // First set loading
      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.state.loading).toBe(true);

      // Then set error
      act(() => {
        result.current.setError('Test error message');
      });

      expect(result.current.state.error).toBe('Test error message');
      expect(result.current.state.loading).toBe(false); // Should be cleared
    });

    test('setError can clear error state', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: createWrapper(),
      });

      // First set error
      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.state.error).toBe('Test error');

      // Then clear error
      act(() => {
        result.current.setError(null);
      });

      expect(result.current.state.error).toBe(null);
    });
  });

  describe('State Immutability', () => {
    /**
     * Tests state immutability patterns
     * @description Ensures state updates follow immutable patterns
     */
    test('state updates create new objects', () => {
      const { result } = renderHook(() => useApp(), {
        wrapper: createWrapper(),
      });

      const originalState = result.current.state;
      const originalContactData = result.current.state.contactData;

      act(() => {
        result.current.updateContactData({ name: 'John Doe' });
      });

      // State should be a new object
      expect(result.current.state).not.toBe(originalState);

      // Contact data should be a new object
      expect(result.current.state.contactData).not.toBe(originalContactData);

      // But the structure should be maintained
      expect(result.current.state.contactData.name).toBe('John Doe');
    });
  });
});
