/**
 * Utility Functions Test Suite
 *
 * @description Comprehensive tests for utility functions including validation,
 * formatting, sanitization, and business logic helpers. Tests ensure reliability
 * and security of core utility functions used throughout the application.
 */

import {
  formatPrice,
  formatDuration,
  validateContactForm,
  isValidEmail,
  isValidPhoneNumber,
  sanitizeString,
  generateId,
  debounce,
  cn,
} from '../index';
import { mockDataFactory } from '../../__tests__/testUtils';

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    /**
     * Tests price formatting with various numeric inputs
     * @description Ensures consistent currency formatting across different locales and values
     */
    test('formats EUR currency correctly', () => {
      expect(formatPrice(35.50)).toBe('€35.50');
      expect(formatPrice(1250)).toBe('€1,250.00');
      expect(formatPrice(0)).toBe('€0.00');
    });

    test('handles edge cases', () => {
      expect(formatPrice(-25)).toBe('-€25.00');
      expect(formatPrice(0.01)).toBe('€0.01');
      expect(formatPrice(999999.99)).toBe('€999,999.99');
    });

    test('handles decimal precision', () => {
      expect(formatPrice(10.1)).toBe('€10.10');
      expect(formatPrice(10.99)).toBe('€10.99');
      expect(formatPrice(10.999)).toBe('€11.00'); // Rounds to nearest cent
    });
  });

  describe('formatDuration', () => {
    /**
     * Tests duration formatting for service display
     * @description Ensures proper duration formatting for various time periods
     */
    test('formats minutes correctly', () => {
      expect(formatDuration(30)).toBe('30 min');
      expect(formatDuration(45)).toBe('45 min');
      expect(formatDuration(59)).toBe('59 min');
    });

    test('formats hours and minutes correctly', () => {
      expect(formatDuration(60)).toBe('1h');
      expect(formatDuration(90)).toBe('1h 30min');
      expect(formatDuration(120)).toBe('2h');
      expect(formatDuration(150)).toBe('2h 30min');
    });

    test('handles edge cases', () => {
      expect(formatDuration(0)).toBe('0 min');
      expect(formatDuration(1)).toBe('1 min');
      expect(formatDuration(61)).toBe('1h 1min');
    });
  });

  describe('validateContactForm', () => {
    /**
     * Tests contact form validation logic
     * @description Ensures proper contact form validation with appropriate rules
     */
    test('returns no errors for valid data', () => {
      const validData = mockDataFactory.contactFormData();
      const errors = validateContactForm(validData);

      expect(errors).toHaveLength(0);
    });

    test('validates required fields', () => {
      const invalidData = mockDataFactory.contactFormData({
        name: '',
        email: '',
        message: ''
      });

      const errors = validateContactForm(invalidData);

      expect(errors).toContain('Please enter your name');
      expect(errors).toContain('Please enter your email address');
      expect(errors).toContain('Please enter a message');
    });

    test('validates email format', () => {
      const invalidData = mockDataFactory.contactFormData({
        email: 'invalid-email'
      });

      const errors = validateContactForm(invalidData);

      expect(errors).toContain('Please enter a valid email address');
    });

    test('validates optional phone number when provided', () => {
      const invalidData = mockDataFactory.contactFormData({
        phoneNumber: 'invalid-phone'
      });

      const errors = validateContactForm(invalidData);

      expect(errors).toContain('Please enter a valid phone number');
    });

    test('allows empty phone number', () => {
      const validData = mockDataFactory.contactFormData({
        phoneNumber: ''
      });

      const errors = validateContactForm(validData);

      expect(errors).not.toContain('Please enter a valid phone number');
    });
  });

  describe('isValidEmail', () => {
    /**
     * Tests email validation with various email formats
     * @description Ensures RFC-compliant email validation
     */
    test('validates correct email formats', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.co.uk',
        'user+tag@example.org',
        'firstname.lastname@company.com',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    test('rejects invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user space@example.com',
        'user..double.dot@example.com',
        ''
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  describe('isValidPhoneNumber', () => {
    /**
     * Tests phone number validation with international formats
     * @description Ensures flexible phone number validation
     */
    test('validates correct phone formats', () => {
      const validPhones = [
        '555-123-4567',
        '(555) 123-4567',
        '+1 555 123 4567',
        '15551234567',
        '+44 20 7946 0958',
        '555.123.4567'
      ];

      validPhones.forEach(phone => {
        expect(isValidPhoneNumber(phone)).toBe(true);
      });
    });

    test('rejects invalid phone formats', () => {
      const invalidPhones = [
        'abc-def-ghij',
        '123',
        '0123456789012345678', // Too long
        '+',
        '555-abc-defg',
        ''
      ];

      invalidPhones.forEach(phone => {
        expect(isValidPhoneNumber(phone)).toBe(false);
      });
    });
  });

  describe('sanitizeString', () => {
    /**
     * Tests string sanitization for security
     * @description Ensures XSS prevention through input sanitization
     */
    test('escapes dangerous HTML characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>Hello')).toBe('Hello');
      expect(sanitizeString('Hello<>World')).toBe('Hello&lt;&gt;World');
      expect(sanitizeString('<div>Content</div>')).toBe('&lt;div&gt;Content&lt;&#47;div&gt;');
    });

    test('trims whitespace', () => {
      expect(sanitizeString('  Hello World  ')).toBe('Hello World');
      expect(sanitizeString('\n\tTest\n\t')).toBe('Test');
    });

    test('preserves safe content', () => {
      expect(sanitizeString('Normal text content')).toBe('Normal text content');
      expect(sanitizeString('Text with numbers 123')).toBe('Text with numbers 123');
      expect(sanitizeString('Email: user@example.com')).toBe('Email: user@example.com');
    });

    test('handles empty and null inputs', () => {
      expect(sanitizeString('')).toBe('');
      expect(sanitizeString('   ')).toBe('');
    });
  });

  describe('generateId', () => {
    /**
     * Tests unique ID generation
     * @description Ensures reliable unique identifier generation
     */
    test('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(0);
      expect(id2.length).toBeGreaterThan(0);
    });

    test('generates IDs without spaces or special characters', () => {
      const id = generateId();

      expect(id).toMatch(/^[a-z0-9]+$/);
      expect(id).not.toContain(' ');
      expect(id).not.toContain('-');
      expect(id).not.toContain('_');
    });

    test('generates multiple unique IDs', () => {
      const ids = Array.from({ length: 100 }, generateId);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('debounce', () => {
    /**
     * Tests debounce function for performance optimization
     * @description Ensures proper debouncing behavior for expensive operations
     */
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('cancels previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(1000);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('passes arguments correctly', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 1000);

      debouncedFn('arg1', 'arg2');
      jest.advanceTimersByTime(1000);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('cn (className utility)', () => {
    /**
     * Tests className utility for conditional styling
     * @description Ensures proper class name concatenation and filtering
     */
    test('combines class names correctly', () => {
      expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
    });

    test('filters falsy values', () => {
      expect(cn('class1', null, 'class2', undefined, 'class3', false)).toBe('class1 class2 class3');
    });

    test('handles conditional classes', () => {
      const isActive = true;
      const isDisabled = false;

      expect(cn('btn', isActive ? 'active' : '', isDisabled ? 'disabled' : '')).toBe('btn active');
    });

    test('handles empty input', () => {
      expect(cn()).toBe('');
      expect(cn(null, undefined, false)).toBe('');
    });

    test('handles mixed types', () => {
      expect(cn('base', true ? 'conditional' : '', false ? 'hidden' : '', 'final')).toBe('base conditional final');
    });
  });
});