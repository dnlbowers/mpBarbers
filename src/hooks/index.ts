/**
 * Custom Hooks - Reusable business logic
 * Encapsulates component logic following React patterns
 */

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { submitBooking, checkAvailability } from '../services/bookingService';
import type { BookingFormData, TimeSlot } from '../types';
import { generateTimeSlots, validateBookingForm } from '../utils';

/**
 * Hook for managing booking form
 */
export const useBookingForm = () => {
  const { state, updateBookingData, setLoading, setError, resetBookingData } = useApp();
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: keyof BookingFormData, value: string) => {
    updateBookingData({ [field]: value });
    // Clear errors when user starts typing
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  }, [updateBookingData, formErrors.length]);

  const validateForm = useCallback((): boolean => {
    const errors = validateBookingForm(state.bookingData);
    setFormErrors(errors);
    return errors.length === 0;
  }, [state.bookingData]);

  const submitForm = useCallback(async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    setLoading(true);
    setError(null);

    try {
      const result = await submitBooking(state.bookingData);
      
      if (result.success) {
        resetBookingData();
        setFormErrors([]);
        return true;
      } else {
        setError(result.error?.message || 'Booking failed');
        return false;
      }
    } catch (error) {
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [validateForm, state.bookingData, setLoading, setError, resetBookingData]);

  return {
    formData: state.bookingData,
    formErrors,
    isSubmitting,
    updateField,
    validateForm,
    submitForm,
    resetForm: resetBookingData,
  };
};

/**
 * Hook for managing time slots
 */
export const useTimeSlots = (selectedDate: string) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }

    const loadTimeSlots = async () => {
      setLoading(true);
      try {
        const date = new Date(selectedDate);
        const slots = generateTimeSlots(date);
        
        // Check availability for each slot
        const slotsWithAvailability = await Promise.all(
          slots.map(async (slot) => {
            const availabilityResult = await checkAvailability(selectedDate, slot.time);
            return {
              ...slot,
              available: availabilityResult.success ? availabilityResult.data || false : false,
            };
          })
        );

        setTimeSlots(slotsWithAvailability);
      } catch (error) {
        console.error('Error loading time slots:', error);
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };

    loadTimeSlots();
  }, [selectedDate]);

  return { timeSlots, loading };
};

/**
 * Hook for managing mobile menu
 */
export const useMobileMenu = () => {
  const { state, toggleMobileMenu, closeMobileMenu } = useApp();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && state.mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && state.mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [state.mobileMenuOpen, closeMobileMenu]);

  return {
    isOpen: state.mobileMenuOpen,
    toggle: toggleMobileMenu,
    close: closeMobileMenu,
  };
};

/**
 * Hook for form validation
 */
export const useFormValidation = <T extends Record<string, any>>(
  initialData: T,
  validationFn: (data: T) => string[]
) => {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState<Set<keyof T>>(new Set());

  const updateField = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => new Set(prev).add(field));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  }, [errors.length]);

  const validate = useCallback((): boolean => {
    const validationErrors = validationFn(data);
    setErrors(validationErrors);
    return validationErrors.length === 0;
  }, [data, validationFn]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors([]);
    setTouched(new Set());
  }, [initialData]);

  return {
    data,
    errors,
    touched,
    updateField,
    validate,
    reset,
    isValid: errors.length === 0,
  };
};
