import type { ContactFormData } from '../types';
import { APP_CONFIG } from '../constants';

/**
 * Formats numeric price values to localized currency strings using Intl.NumberFormat
 * for consistent internationalization support across different locales and regions.
 *
 * @param price - Price value in the base currency unit
 * @returns Formatted currency string with proper locale formatting
 *
 * @example
 * ```typescript
 * formatPrice(35.50); // "$35.50" (US locale)
 * formatPrice(3500);  // "$3,500.00" (US locale)
 * ```
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat(APP_CONFIG.locale, {
    style: 'currency',
    currency: APP_CONFIG.defaultCurrency,
  }).format(price);
};

/**
 * Converts minute-based duration to human-readable format with proper
 * pluralization for service duration display.
 *
 * @param minutes - Duration in minutes
 * @returns Human-readable duration string
 *
 * @example
 * ```typescript
 * formatDuration(30);  // "30 min"
 * formatDuration(90);  // "1h 30min"
 * formatDuration(120); // "2h"
 * ```
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};

/**
 * Validates contact form submissions with comprehensive field validation
 * and business rule enforcement for customer communication.
 *
 * @param data - Contact form data to validate
 * @returns Array of validation error messages
 */
export const validateContactForm = (data: ContactFormData): string[] => {
  const errors: string[] = [];

  if (!data.name.trim()) {
    errors.push('Please enter your name');
  }

  if (!data.email.trim()) {
    errors.push('Please enter your email address');
  } else if (!isValidEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!data.message.trim()) {
    errors.push('Please enter a message');
  }

  if (data.phoneNumber && !isValidPhoneNumber(data.phoneNumber)) {
    errors.push('Please enter a valid phone number');
  }

  return errors;
};

/**
 * Validates email addresses using RFC-compliant regex pattern for
 * reliable email format verification in form submissions.
 *
 * @param email - Email address to validate
 * @returns Boolean indicating valid email format
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const trimmedEmail = email.trim();

  if (trimmedEmail.includes('..')) return false;

  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmedEmail);
};

/**
 * Validates phone numbers with flexible formatting support for
 * international numbers while maintaining security constraints.
 *
 * @param phone - Phone number to validate
 * @returns Boolean indicating valid phone format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-().+]/g, '');
  const phoneRegex = /^\d{7,15}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Sanitizes user input strings to prevent XSS attacks and ensure data integrity.
 * Removes script tags and escapes dangerous HTML characters while preserving content.
 *
 * @param input - String to sanitize
 * @returns Sanitized string safe for storage and display
 */
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^>]*>[^<]*<\/script>/gi, '')
    .replace(/[&<>"'`=/]/g, (char) => {
      const escapeMap: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#96;',
        '=': '&#61;',
        '/': '&#47;',
      };
      return escapeMap[char] || char;
    });
};

/**
 * Generates unique identifiers using timestamp and cryptographically secure
 * random components for reliable unique ID creation in client-side operations.
 *
 * @returns Unique string identifier
 */
export const generateId = (): string => {
  const timestamp = Date.now().toString(36);

  if (globalThis?.crypto?.getRandomValues) {
    const randomBytes = new Uint8Array(6);
    globalThis.crypto.getRandomValues(randomBytes);
    const randomString = Array.from(randomBytes, byte => byte.toString(36)).join('');
    return timestamp + randomString;
  }

  let counter = (generateId as any).counter || 0;
  (generateId as any).counter = (counter + 1) % 1000;
  return timestamp + counter.toString(36).padStart(2, '0');
};

/**
 * Creates debounced version of functions for performance optimization,
 * particularly useful for search inputs, API calls, and expensive operations.
 *
 * @param func - Function to debounce
 * @param wait - Debounce delay in milliseconds
 * @returns Debounced function
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   performSearch(query);
 * }, 300);
 * ```
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Utility function for conditionally combining CSS class names.
 * Filters falsy values and combines valid class names for dynamic styling.
 *
 * @param classes - Array of class names, conditions, or falsy values
 * @returns Combined class name string
 *
 * @example
 * ```typescript
 * const className = cn(
 *   'btn',
 *   variant === 'primary' && 'btn-primary',
 *   disabled && 'btn-disabled',
 *   customClass
 * );
 * ```
 */
export const cn = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};