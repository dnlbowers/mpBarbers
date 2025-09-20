/**
 * Hooks Index Tests
 * Testing custom hooks functionality
 */

import { renderHook } from '@testing-library/react';
import { AppProvider } from '../../contexts/AppContext';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

describe('Custom Hooks', () => {
  let useMobileMenu: any;
  let useFormValidation: any;

  beforeEach(() => {
    // Import hooks dynamically to avoid import errors
    const hooks = require('../index');
    useMobileMenu = hooks.useMobileMenu;
    useFormValidation = hooks.useFormValidation;
  });

  describe('useMobileMenu', () => {
    test('provides mobile menu state and controls', () => {
      const { result } = renderHook(() => useMobileMenu(), { wrapper });

      expect(result.current).toHaveProperty('isOpen');
      expect(result.current).toHaveProperty('toggle');
      expect(result.current).toHaveProperty('close');
      expect(typeof result.current.isOpen).toBe('boolean');
      expect(typeof result.current.toggle).toBe('function');
      expect(typeof result.current.close).toBe('function');
    });
  });

  describe('useFormValidation', () => {
    const mockValidationFn = jest.fn().mockReturnValue([]);
    const initialData = { name: '', email: '' };

    test('provides form validation functionality', () => {
      const { result } = renderHook(
        () => useFormValidation(initialData, mockValidationFn),
        { wrapper }
      );

      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('errors');
      expect(result.current).toHaveProperty('updateField');
      expect(result.current).toHaveProperty('validate');
      expect(result.current).toHaveProperty('reset');
      expect(result.current).toHaveProperty('isValid');
    });

    test('initializes with provided data', () => {
      const { result } = renderHook(
        () => useFormValidation(initialData, mockValidationFn),
        { wrapper }
      );

      expect(result.current.data).toEqual(initialData);
      expect(result.current.errors).toEqual([]);
      expect(result.current.isValid).toBe(true);
    });
  });
});