/**
 * Modern Test Utilities for React 18 + TypeScript
 * 
 * @author Luciano Greiner dos Santos & Istvan Jozsa approach
 * 
 * WHY: React 18 uses renderHook built into @testing-library/react (no deprecated libraries)
 * WHAT: Clean, immutable testing patterns with one-way data flow
 * HOW: Modern React 18 compatible utilities with efficient, scalable patterns
 */

import React from 'react';
import { render, RenderOptions, RenderResult, renderHook, RenderHookOptions } from '@testing-library/react';
import { AppProvider } from '../contexts/AppContext';
import { runAxeTest } from './setupTests';
import type { BookingFormData, ContactFormData, Service } from '../types';

// CLEAN ARCHITECTURE: Separate concerns for different test scenarios
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * IMMUTABLE STATE: Initial context state (never mutated)
   */
  initialState?: {
    services?: Service[];
    bookings?: BookingFormData[];
    contacts?: ContactFormData[];
    loading?: boolean;
    error?: string | null;
  };
  /**
   * ONE-WAY DATA FLOW: Context providers for dependency injection
   */
  providers?: React.ComponentType<{ children: React.ReactNode }>[];
}

/**
 * EFFICIENT RENDERING: Modern React 18 compatible render with context
 * 
 * WHY: Provides consistent testing environment with app context
 * WHAT: Wraps components with providers and returns testing utilities
 * HOW: Uses composition pattern for clean, scalable test setup
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): RenderResult => {
  const { initialState, providers = [], ...renderOptions } = options;

  // IMMUTABLE PATTERN: Create wrapper without mutating original
  const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // ONE-WAY DATA FLOW: Providers compose in predictable order
    const wrappedChildren = providers.reduce(
      (acc, Provider) => <Provider>{acc}</Provider>,
      <AppProvider initialState={initialState}>{children}</AppProvider>
    );
    
    return <>{wrappedChildren}</>;
  };

  return render(ui, { wrapper: AllProviders, ...renderOptions });
};

/**
 * ACCESSIBILITY-FIRST: Render with automatic a11y testing
 * 
 * WHY: Ensures components meet accessibility standards
 * WHAT: Combines rendering with axe-core accessibility testing
 * HOW: Runs axe after render, provides clean error reporting
 */
export const renderWithA11yTesting = async (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
): Promise<RenderResult> => {
  const result = renderWithProviders(ui, options);
  
  // CLEAN TESTING: Non-blocking accessibility validation
  await runAxeTest(result.container);
  
  return result;
};

/**
 * MODERN HOOK TESTING: React 18+ compatible hook testing
 * 
 * WHY: renderHook is now built into @testing-library/react
 * WHAT: Provides clean hook testing with context support
 * HOW: Uses modern renderHook API with wrapper composition
 */
export const renderHookWithContext = <TProps, TResult>(
  hook: (props: TProps) => TResult,
  options: RenderHookOptions<TProps> & CustomRenderOptions = {}
) => {
  const { initialState, providers = [], ...hookOptions } = options;

  // IMMUTABLE WRAPPER: Same pattern as component testing  
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
 * EFFICIENT TEST DATA: Immutable test data factories
 * 
 * WHY: Prevents test pollution and ensures predictable state
 * WHAT: Factory functions that return fresh data objects
 * HOW: Uses object spread for immutable data creation
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
 * LEGACY COMPATIBILITY: mockDataFactory object for existing tests
 * 
 * WHY: Maintains compatibility with existing test files
 * WHAT: Provides the mockDataFactory object that tests expect
 * HOW: Maps to the new factory functions above
 */
export const mockDataFactory = {
  bookingFormData: createTestBooking,
  contactFormData: createTestContact,
  service: createTestService
};

/**
 * CLEAN MOCK FACTORIES: Predictable mock functions
 * 
 * WHY: Consistent API responses across tests
 * WHAT: Pre-configured mock functions for different scenarios
 * HOW: Factory pattern with immutable configurations
 */
export const createApiMocks = {
  success: <T>(data: T) => jest.fn().mockResolvedValue({ success: true, data }),
  error: (message = 'Test error', code = 'TEST_ERROR') => 
    jest.fn().mockResolvedValue({ success: false, error: { message, code } }),
  networkError: (message = 'Network error') => jest.fn().mockRejectedValue(new Error(message))
};

/**
 * PERFORMANCE TESTING: Utilities for performance validation
 * 
 * WHY: Ensures components perform well under test conditions
 * WHAT: Timing and memory usage validation utilities
 * HOW: Provides clean API for performance assertions
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

// DEFAULT EXPORT: Main testing utilities
export { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
export { renderHook } from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';

// BASIC TEST: Ensures test utils file works correctly
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
