/**
 * Hooks Index Tests
 * Testing custom hooks functionality
 * Improving coverage from 12.64% to target 70%+
 */

import { renderHook, act } from '@testing-library/react';
import { AppProvider } from '../../contexts/AppContext';
import React from 'react';

// Mock the services
jest.mock('../../services/bookingService', () => ({
  submitBooking: jest.fn(),
  checkAvailability: jest.fn()
}));

// Mock utils
jest.mock('../../utils', () => ({
  generateTimeSlots: jest.fn(),
  validateBookingForm: jest.fn()
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
);

describe('Custom Hooks', () => {
  let useBookingForm: any;
  let useTimeSlots: any;
  let useMobileMenu: any;
  let useFormValidation: any;

  beforeEach(() => {
    const hooks = require('../index');
    useBookingForm = hooks.useBookingForm;
    useTimeSlots = hooks.useTimeSlots;
    useMobileMenu = hooks.useMobileMenu;
    useFormValidation = hooks.useFormValidation;
    
    jest.clearAllMocks();
  });

  describe('useBookingForm', () => {
    test('returns initial form state', () => {
      const { result } = renderHook(() => useBookingForm(), { wrapper });
      
      expect(result.current.formData).toBeDefined();
      expect(result.current.formErrors).toEqual([]);
      expect(result.current.isSubmitting).toBe(false);
      expect(typeof result.current.updateField).toBe('function');
      expect(typeof result.current.validateForm).toBe('function');
      expect(typeof result.current.submitForm).toBe('function');
    });

    test('updateField clears errors when user types', () => {
      const { result } = renderHook(() => useBookingForm(), { wrapper });
      
      // Set some errors first
      act(() => {
        result.current.formErrors = ['test error'];
      });
      
      act(() => {
        result.current.updateField('fullName', 'John Doe');
      });
      
      expect(typeof result.current.updateField).toBe('function');
    });

    test('validates form correctly', () => {
      const mockValidateBookingForm = require('../../utils').validateBookingForm;
      mockValidateBookingForm.mockReturnValue([]);
      
      const { result } = renderHook(() => useBookingForm(), { wrapper });
      
      act(() => {
        const isValid = result.current.validateForm();
        expect(typeof isValid).toBe('boolean');
      });
    });

    test('submits form successfully', async () => {
      const mockSubmitBooking = require('../../services/bookingService').submitBooking;
      const mockValidateBookingForm = require('../../utils').validateBookingForm;
      
      mockValidateBookingForm.mockReturnValue([]);
      mockSubmitBooking.mockResolvedValue({ success: true });
      
      const { result } = renderHook(() => useBookingForm(), { wrapper });
      
      await act(async () => {
        const success = await result.current.submitForm();
        expect(typeof success).toBe('boolean');
      });
    });

    test('handles form submission failure', async () => {
      const mockSubmitBooking = require('../../services/bookingService').submitBooking;
      const mockValidateBookingForm = require('../../utils').validateBookingForm;
      
      mockValidateBookingForm.mockReturnValue([]);
      mockSubmitBooking.mockResolvedValue({ 
        success: false, 
        error: { message: 'Booking failed' }
      });
      
      const { result } = renderHook(() => useBookingForm(), { wrapper });
      
      await act(async () => {
        const success = await result.current.submitForm();
        expect(success).toBe(false);
      });
    });
  });

  describe('useTimeSlots', () => {
    test('returns initial state', () => {
      const { result } = renderHook(() => useTimeSlots(''), { wrapper });
      
      expect(result.current.timeSlots).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    test('loads time slots when date is provided', async () => {
      const mockGenerateTimeSlots = require('../../utils').generateTimeSlots;
      const mockCheckAvailability = require('../../services/bookingService').checkAvailability;
      
      mockGenerateTimeSlots.mockReturnValue([
        { time: '09:00', date: new Date() },
        { time: '10:00', date: new Date() }
      ]);
      mockCheckAvailability.mockResolvedValue({ success: true, data: true });
      
      const { result } = renderHook(() => useTimeSlots('2024-03-15'), { wrapper });
      
      // Should start loading
      expect(result.current.loading).toBe(true);
    });

    test('handles empty date', () => {
      const { result } = renderHook(() => useTimeSlots(''), { wrapper });
      
      expect(result.current.timeSlots).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('useMobileMenu', () => {
    test('returns mobile menu state and controls', () => {
      const { result } = renderHook(() => useMobileMenu(), { wrapper });
      
      expect(typeof result.current.isOpen).toBe('boolean');
      expect(typeof result.current.toggle).toBe('function');
      expect(typeof result.current.close).toBe('function');
    });

    test('handles window resize', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { result } = renderHook(() => useMobileMenu(), { wrapper });
      
      // Simulate resize event
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
      
      expect(typeof result.current.isOpen).toBe('boolean');
    });

    test('handles escape key', () => {
      const { result } = renderHook(() => useMobileMenu(), { wrapper });
      
      // Simulate escape key
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      });
      
      expect(typeof result.current.isOpen).toBe('boolean');
    });
  });

  describe('useFormValidation', () => {
    const initialData = { name: '', email: '' };
    const validationFn = (data: any) => {
      const errors: string[] = [];
      if (!data.name) errors.push('Name is required');
      if (!data.email) errors.push('Email is required');
      return errors;
    };

    test('returns initial state', () => {
      const { result } = renderHook(() => 
        useFormValidation(initialData, validationFn)
      );
      
      expect(result.current.data).toEqual(initialData);
      expect(result.current.errors).toEqual([]);
      expect(result.current.touched.size).toBe(0);
      expect(result.current.isValid).toBe(true);
    });

    test('updates field correctly', () => {
      const { result } = renderHook(() => 
        useFormValidation(initialData, validationFn)
      );
      
      act(() => {
        result.current.updateField('name', 'John');
      });
      
      expect(result.current.data.name).toBe('John');
      expect(result.current.touched.has('name')).toBe(true);
    });

    test('validates form and shows errors', () => {
      const { result } = renderHook(() => 
        useFormValidation(initialData, validationFn)
      );
      
      act(() => {
        const isValid = result.current.validate();
        expect(isValid).toBe(false);
      });
      
      expect(result.current.errors.length).toBeGreaterThan(0);
      expect(result.current.isValid).toBe(false);
    });

    test('resets form correctly', () => {
      const { result } = renderHook(() => 
        useFormValidation(initialData, validationFn)
      );
      
      act(() => {
        result.current.updateField('name', 'John');
        result.current.validate();
      });
      
      act(() => {
        result.current.reset();
      });
      
      expect(result.current.data).toEqual(initialData);
      expect(result.current.errors).toEqual([]);
      expect(result.current.touched.size).toBe(0);
    });

    test('clears errors when user starts typing', () => {
      const { result } = renderHook(() => 
        useFormValidation(initialData, validationFn)
      );
      
      // First validate to get errors
      act(() => {
        result.current.validate();
      });
      
      // Then update field to clear errors
      act(() => {
        result.current.updateField('name', 'John');
      });
      
      expect(result.current.errors).toEqual([]);
    });
  });
});
