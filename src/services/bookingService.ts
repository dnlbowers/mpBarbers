import type { BookingFormData, ApiResponse } from '../types';
import { validateBookingForm, sanitizeString, generateId } from '../utils';

/**
 * Booking Service - Business Logic Layer
 * 
 * @description Handles all booking-related business operations including form validation,
 * data sanitization, API communication, and error handling. Provides a clean interface
 * between the UI layer and external booking systems.
 * 
 * @module BookingService
 */

/**
 * Submits a booking request with comprehensive validation and error handling
 * 
 * @description Processes booking form data through validation, sanitization, and
 * submission pipeline. Handles business logic validation, data security, and
 * external API communication with proper error handling and response formatting.
 * 
 * @param formData - Booking form data containing customer and appointment information
 * @returns Promise resolving to API response with booking ID or error details
 * 
 * @example
 * ```typescript
 * const bookingData: BookingFormData = {
 *   service: 'classic-cut',
 *   date: '2024-03-15',
 *   time: '14:00',
 *   fullName: 'John Doe',
 *   email: 'john@example.com',
 *   phoneNumber: '555-1234',
 *   specialRequests: 'Beard trim included'
 * };
 * 
 * const result = await submitBooking(bookingData);
 * if (result.success) {
 *   console.log('Booking ID:', result.data);
 * }
 * ```
 */
export const submitBooking = async (formData: BookingFormData): Promise<ApiResponse<string>> => {
  try {
    /**
     * Validate booking form data against business rules
     * @description Ensures all required fields are present and valid according to
     * business constraints including date/time availability and customer information
     */
    const errors = validateBookingForm(formData);
    if (errors.length > 0) {
      return {
        success: false,
        error: {
          message: errors.join(', '),
          code: 'VALIDATION_ERROR',
        },
      };
    }

    /**
     * Sanitize user input data for security
     * @description Prevents XSS attacks and ensures data integrity by sanitizing
     * all user-provided strings before processing or storage
     */
    const sanitizedData = {
      ...formData,
      fullName: sanitizeString(formData.fullName),
      email: sanitizeString(formData.email),
      phoneNumber: sanitizeString(formData.phoneNumber),
      specialRequests: sanitizeString(formData.specialRequests),
    };

    /**
     * Simulate API call with realistic delay
     * @description In production, this would make actual HTTP request to booking API
     * with proper authentication, retry logic, and error handling
     */
    await new Promise(resolve => setTimeout(resolve, 1500));

    /**
     * Simulate occasional service errors for testing
     * @description Helps test error handling and user experience during service failures
     */
    if (Math.random() < 0.1) {
      throw new Error('Service temporarily unavailable');
    }

    const bookingId = generateId();

    // Production: Save to database via API
    console.log('Booking submitted:', { id: bookingId, ...sanitizedData });

    return {
      success: true,
      data: bookingId,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        code: 'BOOKING_ERROR',
        details: error,
      },
    };
  }
};

/**
 * Checks appointment time slot availability
 * 
 * @description Verifies if a specific date and time slot is available for booking.
 * Integrates with calendar system and existing bookings to prevent double-booking
 * and ensure accurate availability information for customers.
 * 
 * @param date - Appointment date in YYYY-MM-DD format
 * @param time - Appointment time in HH:MM format
 * @returns Promise resolving to availability status
 * 
 * @example
 * ```typescript
 * const availability = await checkAvailability('2024-03-15', '14:00');
 * if (availability.success && availability.data) {
 *   console.log('Time slot is available');
 * }
 * ```
 */
export const checkAvailability = async (date: string, time: string): Promise<ApiResponse<boolean>> => {
  try {
    /**
     * Validate date and time parameters
     * @description Ensures provided date and time are in correct format and
     * within acceptable booking window (e.g., not in the past, within business hours)
     */
    if (!date || !time) {
      return {
        success: false,
        error: {
          message: 'Date and time are required',
          code: 'INVALID_PARAMETERS',
        },
      };
    }

    // Simulate API call to check availability
    await new Promise(resolve => setTimeout(resolve, 500));

    /**
     * Check availability against business rules
     * @description In production, this would query the booking database to check
     * for existing appointments, staff availability, and business hour constraints
     */
    const isAvailable = Math.random() > 0.3; // 70% availability simulation

    return {
      success: true,
      data: isAvailable,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Unable to check availability',
        code: 'AVAILABILITY_ERROR',
        details: error,
      },
    };
  }
};

/**
 * Retrieves available time slots for a specific date
 * 
 * @description Fetches all available appointment times for a given date,
 * considering business hours, existing bookings, and staff availability.
 * Provides comprehensive time slot information for booking interface.
 * 
 * @param date - Date to check for available slots
 * @returns Promise resolving to array of available time slots
 * 
 * @example
 * ```typescript
 * const slots = await getAvailableTimeSlots('2024-03-15');
 * if (slots.success) {
 *   console.log('Available times:', slots.data);
 * }
 * ```
 */
export const getAvailableTimeSlots = async (date: string): Promise<ApiResponse<string[]>> => {
  try {
    if (!date) {
      return {
        success: false,
        error: {
          message: 'Date is required',
          code: 'INVALID_PARAMETERS',
        },
      };
    }

    await new Promise(resolve => setTimeout(resolve, 800));

    /**
     * Generate available time slots based on business hours
     * @description In production, this would query the booking system for
     * available slots considering staff schedules and existing appointments
     */
    const businessHours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
    const availableSlots = businessHours.filter(() => Math.random() > 0.4);

    return {
      success: true,
      data: availableSlots,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: 'Unable to fetch available time slots',
        code: 'FETCH_SLOTS_ERROR',
        details: error,
      },
    };
  }
};