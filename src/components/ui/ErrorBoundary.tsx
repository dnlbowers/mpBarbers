import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component
 * 
 * @description Implements React Error Boundary pattern to catch JavaScript errors
 * anywhere in the child component tree. Provides graceful error handling with
 * user-friendly fallback UI and optional error reporting integration.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary
 *   onError={(error, errorInfo) => logErrorToService(error, errorInfo)}
 *   fallback={<CustomErrorUI />}
 * >
 *   <App />
 * </ErrorBoundary>
 * ```
 * 
 * @extends React.Component
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Static method to update state when an error occurs
   * 
   * @description Called during the render phase when an error is thrown.
   * Updates component state to trigger fallback UI rendering on next render cycle.
   * 
   * @param error - The error that was thrown
   * @returns Updated state object indicating error occurred
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called after an error has been thrown
   * 
   * @description Handles error logging and reporting after component tree error.
   * Integrates with error monitoring services and calls optional error handler callback
   * for custom error processing or analytics tracking.
   * 
   * @param error - The error that was thrown
   * @param errorInfo - Additional information about the error
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Renders either error fallback UI or normal children
   * 
   * @description Conditionally renders fallback UI when error state is true,
   * otherwise renders normal child components. Provides comprehensive error
   * display with recovery options and development mode debugging information.
   * 
   * @returns Either fallback error UI or normal children
   */
  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg 
                  className="h-10 w-10 text-red-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-medium text-gray-900">
                  Something went wrong
                </h1>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              We apologize for the inconvenience. The page encountered an unexpected error.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Reload Page
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Go Back
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4">
                <summary className="text-sm text-gray-500 cursor-pointer">
                  Technical Details (Development)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;