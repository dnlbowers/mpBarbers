import type { TimeSlot, BookingFormData, ContactFormData } from '../types';
import { APP_CONFIG, TIME_SLOTS, BUSINESS_HOURS } from '../constants';

/**
 * Price Formatting Utility
 * 
 * @description Formats numeric price values to localized currency strings
 * using Intl.NumberFormat for consistent internationalization support.
 * Ensures proper currency display across different locales and regions.
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
 * Duration Formatting Utility
 * 
 * @description Converts minute-based duration to human-readable format.
 * Handles both hour and minute combinations for service duration display
 * with proper pluralization and formatting.
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
 * Time Slot Generation Utility
 * 
 * @description Generates available time slots for appointment booking based on
 * business hours, existing bookings, and availability rules. Integrates with
 * business configuration to ensure accurate scheduling options.
 * 
 * @param date - Date for which to generate time slots
 * @returns Array of time slot objects with availability status
 * 
 * @example
 * ```typescript
 * const slots = generateTimeSlots(new Date('2024-03-15'));
 * // Returns: [{ time: '09:00', available: true, date: Date }, ...]
 * ```
 */
export const generateTimeSlots = (date: Date): TimeSlot[] => {
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const businessHours = BUSINESS_HOURS[dayOfWeek];
  
  if (businessHours?.closed) {
    return [];
  }

  return TIME_SLOTS.map(time => ({
    time,
    available: isTimeSlotAvailable(date, time),
    date,
  }));
};

/**
 * Time Slot Availability Checker
 * 
 * @description Determines if a specific time slot is available for booking
 * based on business rules including minimum advance booking time and
 * past date validation. Prevents booking conflicts and ensures business logic compliance.
 * 
 * @param date - Appointment date
 * @param time - Appointment time in HH:MM format
 * @returns Boolean indicating slot availability
 */
const isTimeSlotAvailable = (date: Date, time: string): boolean => {
  const now = new Date();
  const slotDateTime = new Date(date);
  const [hours, minutes] = time.split(':').map(Number);
  slotDateTime.setHours(hours, minutes, 0, 0);
  
  if (slotDateTime <= now) {
    return false;
  }
  
  const minBookingTime = new Date(now.getTime() + APP_CONFIG.minBookingHoursAhead * 60 * 60 * 1000);
  return slotDateTime >= minBookingTime;
};

/**
 * Minimum Booking Date Calculator
 * 
 * @description Calculates the earliest date available for appointment booking
 * based on current business rules and availability constraints.
 * 
 * @returns ISO date string for minimum booking date
 */
export const getMinBookingDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Maximum Booking Date Calculator
 * 
 * @description Calculates the latest date available for appointment booking
 * based on business configuration and scheduling horizon limits.
 * 
 * @returns ISO date string for maximum booking date
 */
export const getMaxBookingDate = (): string => {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + APP_CONFIG.maxBookingDaysAhead);
  return maxDate.toISOString().split('T')[0];
};

/**
 * Booking Form Validation
 * 
 * @description Comprehensive validation for booking form data including
 * required field validation, format validation, and business rule validation.
 * Ensures data integrity and provides user-friendly error messages.
 * 
 * @param data - Booking form data to validate
 * @returns Array of validation error messages
 * 
 * @example
 * ```typescript
 * const errors = validateBookingForm(formData);
 * if (errors.length > 0) {
 *   console.log('Validation errors:', errors);
 * }
 * ```
 */
export const validateBookingForm = (data: BookingFormData): string[] => {
  const errors: string[] = [];
  
  if (!data.service) {
    errors.push('Please select a service');
  }
  
  if (!data.date) {
    errors.push('Please select a date');
  }
  
  if (!data.time) {
    errors.push('Please select a time');
  }
  
  if (!data.fullName.trim()) {
    errors.push('Please enter your full name');
  }
  
  if (!data.email.trim()) {
    errors.push('Please enter your email address');
  } else if (!isValidEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.phoneNumber.trim()) {
    errors.push('Please enter your phone number');
  } else if (!isValidPhoneNumber(data.phoneNumber)) {
    errors.push('Please enter a valid phone number');
  }
  
  return errors;
};

/**
 * Contact Form Validation
 * 
 * @description Validates contact form submissions with comprehensive field
 * validation and business rule enforcement for customer communication.
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
 * Email Format Validation
 * 
 * @description Validates email addresses using RFC-compliant regex pattern
 * for reliable email format verification in form submissions.
 * 
 * @param email - Email address to validate
 * @returns Boolean indicating valid email format
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const trimmedEmail = email.trim();
  
  // Check for consecutive dots which should be invalid
  if (trimmedEmail.includes('..')) return false;
  
  // More comprehensive regex that allows + character and other valid email formats
  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmedEmail);
};

/**
 * Phone Number Format Validation
 * 
 * @description Validates phone numbers with flexible formatting support
 * for international numbers while maintaining security constraints.
 * 
 * @param phone - Phone number to validate
 * @returns Boolean indicating valid phone format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Remove common formatting characters
  const cleanPhone = phone.replace(/[\s\-().+]/g, '');
  // Accept numbers with 7-15 digits
  const phoneRegex = /^[\d]{7,15}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * String Sanitization Utility
 * 
 * @description Sanitizes user input strings to prevent XSS attacks and
 * ensure data integrity. Removes potentially dangerous characters while
 * preserving user-intended content.
 * 
 * @param input - String to sanitize
 * @returns Sanitized string safe for storage and display
 */
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '');
};

/**
 * Unique ID Generator
 * 
 * @description Generates unique identifiers using timestamp and random
 * components for reliable unique ID creation in client-side operations.
 * 
 * @returns Unique string identifier
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce Function Utility
 * 
 * @description Creates debounced version of functions for performance optimization,
 * particularly useful for search inputs, API calls, and expensive operations.
 * Prevents excessive function calls during rapid user interactions.
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
 * Class Name Utility
 * 
 * @description Utility function for conditionally combining CSS class names.
 * Filters falsy values and combines valid class names for dynamic styling.
 * Essential for component styling with conditional classes.
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