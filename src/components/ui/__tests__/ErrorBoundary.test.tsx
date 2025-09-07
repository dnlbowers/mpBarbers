/**
 * ErrorBoundary Component Tests
 * Improving coverage from 30.76% to target 85%+
 * Testing error catching and recovery functionality
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Component that throws an error when shouldThrow is true
const ThrowError: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No Error</div>;
};

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('ErrorBoundary Component', () => {
  let ErrorBoundary: React.ComponentType<any>;
  
  beforeEach(() => {
    ErrorBoundary = require('../ErrorBoundary').default;
    (console.error as jest.Mock).mockClear();
  });

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No Error')).toBeInTheDocument();
  });

  test('renders default error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('We apologize for the inconvenience. The page encountered an unexpected error.')).toBeInTheDocument();
    expect(screen.getByText('Reload Page')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  test('renders custom fallback when provided', () => {
    const customFallback = <div>Custom Error UI</div>;
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  test('calls onError callback when error occurs', () => {
    const onError = jest.fn();
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  test('logs error to console when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(console.error).toHaveBeenCalledWith(
      'Error Boundary caught an error:',
      expect.any(Error),
      expect.any(Object)
    );
  });

  test('handles reload page button click', () => {
    // Mock window.location.reload
    const mockReload = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    const reloadButton = screen.getByText('Reload Page');
    fireEvent.click(reloadButton);
    
    expect(mockReload).toHaveBeenCalled();
  });

  test('handles go back button click', () => {
    // Mock window.history.back
    const mockBack = jest.fn();
    Object.defineProperty(window, 'history', {
      value: { back: mockBack },
      writable: true
    });
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    const backButton = screen.getByText('Go Back');
    fireEvent.click(backButton);
    
    expect(mockBack).toHaveBeenCalled();
  });

  test('shows technical details in development mode', () => {
    // Mock development environment
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Technical Details (Development)')).toBeInTheDocument();
    
    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  test('hides technical details in production mode', () => {
    // Mock production environment
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.queryByText('Technical Details (Development)')).not.toBeInTheDocument();
    
    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  test('expands technical details when clicked in development', () => {
    // Mock development environment
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    const detailsElement = screen.getByText('Technical Details (Development)');
    fireEvent.click(detailsElement);
    
    // Should show the error stack
    expect(screen.getByText(/Test error/)).toBeInTheDocument();
    
    // Restore original environment
    process.env.NODE_ENV = originalEnv;
  });

  test('getDerivedStateFromError returns correct state', () => {
    const testError = new Error('Test error');
    const result = ErrorBoundary.getDerivedStateFromError(testError);
    
    expect(result).toEqual({
      hasError: true,
      error: testError
    });
  });

  test('componentDidCatch calls onError prop', () => {
    const onError = jest.fn();
    const errorBoundaryInstance = new ErrorBoundary({ children: null, onError });
    
    const testError = new Error('Test error');
    const errorInfo = { componentStack: 'test stack' };
    
    errorBoundaryInstance.componentDidCatch(testError, errorInfo);
    
    expect(onError).toHaveBeenCalledWith(testError, errorInfo);
    expect(console.error).toHaveBeenCalledWith(
      'Error Boundary caught an error:',
      testError,
      errorInfo
    );
  });

  test('componentDidCatch works without onError prop', () => {
    const errorBoundaryInstance = new ErrorBoundary({ children: null });
    
    const testError = new Error('Test error');
    const errorInfo = { componentStack: 'test stack' };
    
    // Should not throw error when onError is not provided
    expect(() => {
      errorBoundaryInstance.componentDidCatch(testError, errorInfo);
    }).not.toThrow();
    
    expect(console.error).toHaveBeenCalledWith(
      'Error Boundary caught an error:',
      testError,
      errorInfo
    );
  });

  test('renders with proper accessibility attributes', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    // Error icon should have aria-hidden (it's not a role="img" since it's decorative)
    const errorIcon = document.querySelector('svg[aria-hidden="true"]');
    expect(errorIcon).toBeInTheDocument();
    expect(errorIcon).toHaveAttribute('aria-hidden', 'true');
  });

  test('handles multiple children', () => {
    render(
      <ErrorBoundary>
        <div>Child 1</div>
        <div>Child 2</div>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('No Error')).toBeInTheDocument();
  });

  test('error state persists after initial error', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    // Re-render with non-throwing component
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    // Should still show error UI because error boundary state persists
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
