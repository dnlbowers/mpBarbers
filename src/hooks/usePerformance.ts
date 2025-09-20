/**
 * Performance Monitoring Hooks
 * Track component render times and user interactions
 * 
 * IMPORTANT: These hooks are disabled by default to prevent performance issues.
 * Enable only when needed for debugging by setting ENABLE_PERFORMANCE_MONITORING = true
 */

import { useEffect, useRef, useCallback } from 'react';

// Disable performance monitoring by default to prevent slow renders
const ENABLE_PERFORMANCE_MONITORING = false;

/**
 * Hook to measure component render performance
 * DISABLED by default to prevent infinite render loops
 */
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number | undefined>(undefined);
  const mountTime = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!ENABLE_PERFORMANCE_MONITORING) return;
    
    // Record mount time
    mountTime.current = performance.now();
    
    return () => {
      // Record unmount time
      const unmountTime = performance.now();
      const totalLifetime = unmountTime - (mountTime.current || 0);
      
      // Log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} lifetime: ${totalLifetime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  const startRender = useCallback(() => {
    if (!ENABLE_PERFORMANCE_MONITORING) return;
    startTime.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    if (!ENABLE_PERFORMANCE_MONITORING) return;
    
    if (startTime.current) {
      const renderTime = performance.now() - startTime.current;
      
      // Log slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`[Performance] Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    }
  }, [componentName]);

  return { startRender, endRender };
};

/**
 * Hook to track user interactions for analytics
 * Simplified version that doesn't cause performance issues
 */
export const useAnalytics = () => {
  const trackEvent = useCallback((event: string, properties?: Record<string, any>) => {
    // Only track in production or when explicitly enabled
    if (process.env.NODE_ENV === 'development' && !ENABLE_PERFORMANCE_MONITORING) {
      return;
    }
      /* TODO: In production, pick one and send to a analytics service: 
        * gtag('event', event, properties);
        * mixpanel.track(event, properties);
        * amplitude.logEvent(event, properties);  
        * Any others to consider? 
      */
    try {
      
      console.log(`[Analytics] ${event}`, properties);
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }, []);

  const trackPageView = useCallback((pageName: string) => {
    trackEvent('page_view', { page: pageName });
  }, [trackEvent]);

  const trackButtonClick = useCallback((buttonName: string, context?: string) => {
    trackEvent('button_click', { button: buttonName, context });
  }, [trackEvent]);

  const trackFormSubmission = useCallback((formName: string, success: boolean) => {
    trackEvent('form_submission', { form: formName, success });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackButtonClick,
    trackFormSubmission,
  };
};

/**
 * Hook for Web Vitals monitoring (disabled by default)
 */
export const useWebVitals = () => {
  useEffect(() => {
    if (!ENABLE_PERFORMANCE_MONITORING) return;
    
    // Only import and run in browser environment
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals] Monitoring enabled in development mode');
    }
  }, []);
};

/**
 * Hook for memory usage monitoring (disabled by default)
 */
export const useMemoryMonitor = () => {
  useEffect(() => {
    if (!ENABLE_PERFORMANCE_MONITORING) return;
    
    const checkMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        const totalMB = memory.totalJSHeapSize / 1024 / 1024;
        const limitMB = memory.jsHeapSizeLimit / 1024 / 1024;

        if (process.env.NODE_ENV === 'development') {
          console.log(`[Memory] Used: ${usedMB.toFixed(2)}MB, Total: ${totalMB.toFixed(2)}MB, Limit: ${limitMB.toFixed(2)}MB`);
        }

        // Warn if memory usage is high
        if (usedMB > limitMB * 0.8) {
          console.warn('[Memory] High memory usage detected');
        }
      }
    };

    // Check memory usage every 30 seconds in development
    const interval = process.env.NODE_ENV === 'development' 
      ? setInterval(checkMemoryUsage, 30000)
      : null;

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);
};
