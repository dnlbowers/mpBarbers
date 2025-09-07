/**
 * Types Index Tests
 * Testing type definitions and interfaces
 */

import * as Types from '../index';

describe('Types Module', () => {
  test('should export all interface types', () => {
    // Test that all types are available for TypeScript compilation
    const service: Types.Service = {
      id: 'test',
      name: 'Test Service',
      price: 25,
      duration: 30,
      category: 'haircut'
    };

    const timeSlot: Types.TimeSlot = {
      time: '10:00',
      available: true,
      date: new Date()
    };

    const customerInfo: Types.CustomerInfo = {
      fullName: 'John Doe',
      email: 'john@test.com',
      phoneNumber: '555-1234'
    };

    const bookingDetails: Types.BookingDetails = {
      service,
      date: new Date(),
      time: '10:00',
      customer: customerInfo
    };

    // Verify objects are properly typed
    expect(service.id).toBe('test');
    expect(timeSlot.available).toBe(true);
    expect(customerInfo.fullName).toBe('John Doe');
    expect(bookingDetails.service).toBe(service);
  });

  test('should handle form data types', () => {
    const bookingForm: Types.BookingFormData = {
      service: 'classic-cut',
      date: '2024-03-15',
      time: '10:00',
      fullName: 'Jane Doe',
      email: 'jane@test.com',
      phoneNumber: '555-5678',
      specialRequests: 'No special requests'
    };

    const contactForm: Types.ContactFormData = {
      name: 'Test User',
      email: 'test@user.com',
      phoneNumber: '555-9999',
      message: 'Test message'
    };

    expect(bookingForm.service).toBe('classic-cut');
    expect(contactForm.name).toBe('Test User');
  });

  test('should handle API response types', () => {
    const successResponse: Types.ApiResponse<string> = {
      success: true,
      data: 'test-data'
    };

    const errorResponse: Types.ApiResponse<string> = {
      success: false,
      error: {
        message: 'Test error',
        code: 'TEST_ERROR'
      }
    };

    expect(successResponse.success).toBe(true);
    expect(errorResponse.success).toBe(false);
  });

  test('should handle union types', () => {
    const category: Types.ServiceCategory = 'haircut';
    const navTab: Types.NavigationTab = 'home';
    const bookingStep: Types.BookingStep = 'service';

    expect(category).toBe('haircut');
    expect(navTab).toBe('home');
    expect(bookingStep).toBe('service');
  });
});
