/**
 * Custom Hooks - Reusable business logic
 * Encapsulates component logic following React patterns
 */

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';

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
