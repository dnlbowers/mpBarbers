/**
 * Performance Monitoring Hooks
 * Track component render times and user interactions
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to measure component render performance
 */
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number | undefined>(undefined);
  const mountTime = useRef<number | undefined>(undefined);

  useEffect(() => {
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
    startTime.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    if (startTime.current) {
      const renderTime = performance.now() - startTime.current;
      
      // Log slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`[Performance] Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
      
      // In production, you would send this to your analytics service
      // analytics.track('component_render_time', {
      //   component: componentName,
      //   duration: renderTime
      // });
    }
  }, [componentName]);

  return { startRender, endRender };
};

/**
 * Hook to track user interactions for analytics
 */
export const useAnalytics = () => {
  const trackEvent = useCallback((event: string, properties?: Record<string, any>) => {
    // In development, just log
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${event}`, properties);
      return;
    }

    // In production, send to your analytics service
    // Example: Google Analytics, Mixpanel, Amplitude, etc.
    try {
      // gtag('event', event, properties);
      // mixpanel.track(event, properties);
      // amplitude.logEvent(event, properties);
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
 * Hook for Web Vitals monitoring (simplified version)
 */
export const useWebVitals = () => {
  useEffect(() => {
    // Only import and run in browser environment
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals] Monitoring enabled in development mode');
      
      // In production, you would integrate with actual web-vitals library:
      // import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      //   onCLS(sendToAnalytics);
      //   onFID(sendToAnalytics);
      //   onFCP(sendToAnalytics);
      //   onLCP(sendToAnalytics);
      //   onTTFB(sendToAnalytics);
      // });
    }
  }, []);
};

/**
 * Hook for memory usage monitoring
 */
export const useMemoryMonitor = () => {
  useEffect(() => {
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
