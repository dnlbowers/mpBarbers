/**
 * Modern Test Utilities for React 18 + TypeScript
 *
 * Clean, immutable testing patterns with modern React 18 compatible utilities.
 */

import React from 'react';
import { render, RenderOptions, RenderResult, renderHook, RenderHookOptions } from '@testing-library/react';
import { AppProvider } from '../contexts/AppContext';
import { runAxeTest } from './setupTests';
import type { BookingFormData, ContactFormData, Service } from '../types';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: {
    services?: Service[];
    bookings?: BookingFormData[];
    contacts?: ContactFormData[];
    loading?: boolean;
    error?: string | null;
  };
  providers?: React.ComponentType<{ children: React.ReactNode }>[];
}

/**
 * Modern React 18 compatible render with context that provides consistent
 * testing environment with app context and provider composition.
 *
 * @param ui - React element to render
 * @param options - Render options including initial state and providers
 * @returns Render result with testing utilities
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult => {
  const { initialState, providers = [], ...renderOptions } = options;

  const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const wrappedChildren = providers.reduce(
      (acc, Provider) => <Provider>{acc}</Provider>,
      <AppProvider initialState={initialState}>{children}</AppProvider>
    );

    return <>{wrappedChildren}</>;
  };

  return render(ui, { wrapper: AllProviders, ...renderOptions });
};

/**
 * Renders component with automatic accessibility testing using axe-core.
 * Combines rendering with accessibility validation for comprehensive testing.
 *
 * @param ui - React element to render
 * @param options - Render options including initial state and providers
 * @returns Promise resolving to render result after accessibility validation
 */
export const renderWithA11yTesting = async (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): Promise<RenderResult> => {
  const result = renderWithProviders(ui, options);

  await runAxeTest(result.container);

  return result;
};

/**
 * React 18+ compatible hook testing with context support using modern renderHook API.
 *
 * @param hook - Hook function to test
 * @param options - Hook options including initial state and providers
 * @returns Hook render result with testing utilities
 */
export const renderHookWithContext = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  options: RenderHookOptions<TProps> & CustomRenderOptions = {}
) => {
  const { initialState, providers = [], ...hookOptions } = options;

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const wrappedChildren = providers.reduce(
      (acc, Provider) => <Provider>{acc}</Provider>,
      <AppProvider initialState={initialState}>{children}</AppProvider>
    );

    return <>{wrappedChildren}</>;
  };

  return renderHook(hook, { wrapper, ...hookOptions });
};
/**
 * Immutable test data factories that prevent test pollution and ensure predictable state.
 * Factory functions return fresh data objects using object spread for immutability.
 */
export const createTestService = (overrides: Partial<Service> = {}): Service => ({
  id: 'test-service-id',
  name: 'Test Service',
  description: 'Test service description',
  duration: 30,
  price: 25.00,
  currency: 'EUR',
  category: 'haircut',
  available: true,
  ...overrides
});

export const createTestBooking = (overrides: Partial<BookingFormData> = {}): BookingFormData => ({
  service: 'classic-cut',
  date: '2024-03-15',
  time: '14:00',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phoneNumber: '555-123-4567',
  specialRequests: '',
  ...overrides
});

export const createTestContact = (overrides: Partial<ContactFormData> = {}): ContactFormData => ({
  name: 'Jane Smith',
  email: 'jane.smith@example.com',  
  phoneNumber: '555-987-6543',
  message: 'I would like to schedule an appointment.',
  ...overrides
});

/**
 * Legacy compatibility object for existing tests that provides
 * the mockDataFactory interface expected by test files.
 */
export const mockDataFactory = {
  bookingFormData: createTestBooking,
  contactFormData: createTestContact,
  service: createTestService
};

/**
 * Predictable mock functions with consistent API responses across tests.
 * Pre-configured mock functions for different testing scenarios.
 */
export const createApiMocks = {
  success: <T>(data: T) => jest.fn().mockResolvedValue({ success: true, data }),
  error: (message = 'Test error', code = 'TEST_ERROR') => 
    jest.fn().mockResolvedValue({ success: false, error: { message, code } }),
  networkError: (message = 'Network error') => jest.fn().mockRejectedValue(new Error(message))
};

/**
 * Performance testing utilities for timing and validation.
 * Ensures components perform well under test conditions.
 */
export const measureRenderTime = async (
  renderFn: () => Promise<RenderResult> | RenderResult
): Promise<{ result: RenderResult; renderTime: number }> => {
  const startTime = performance.now();
  const result = await renderFn();
  const endTime = performance.now();
  
  return {
    result,
    renderTime: endTime - startTime
  };
};

export { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
export { renderHook } from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';

describe('Test Utils', () => {
  test('test utilities load correctly', () => {
    expect(createTestService).toBeDefined();
    expect(createTestBooking).toBeDefined();
    expect(createTestContact).toBeDefined();
    expect(mockDataFactory).toBeDefined();
  });
  
  test('factory functions create valid test data', () => {
    const service = createTestService();
    expect(service).toHaveProperty('id');
    expect(service).toHaveProperty('name');
    expect(service).toHaveProperty('price');
    
    const booking = createTestBooking();
    expect(booking).toHaveProperty('fullName');
    expect(booking).toHaveProperty('email');
    
    const contact = createTestContact();
    expect(contact).toHaveProperty('name');
    expect(contact).toHaveProperty('email');
  });
});
