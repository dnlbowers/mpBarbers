# Hooks Documentation

## 🎯 Business Logic Layer Architecture

This directory contains custom React hooks that encapsulate business logic, performance monitoring, and application state management. Following **Clean Architecture** principles, these hooks provide a clean separation between UI components and business logic.

### Architectural Principles
- **Single Responsibility**: Each hook has one specific business purpose
- **Pure Functions**: Side-effect isolation and predictable behavior
- **Immutable State**: All state updates follow immutable patterns
- **Type Safety**: Comprehensive TypeScript interfaces
- **Performance Optimized**: Memoized callbacks and efficient re-rendering

## 📦 Hook Library

### Performance Monitoring Hooks (`usePerformance.ts`)

#### usePerformanceMonitor
**Purpose**: Tracks component render performance and lifecycle metrics
**Business Value**: Identifies performance bottlenecks and optimization opportunities
**Integration**: Development logging and production analytics services

```typescript
const { startRender, endRender } = usePerformanceMonitor('ServiceBooking');
```

#### useAnalytics
**Purpose**: Provides user interaction tracking and business intelligence
**Business Value**: Enables data-driven decision making and user behavior analysis
**Events**: Page views, button clicks, form submissions, custom events

```typescript
const { trackButtonClick, trackFormSubmission } = useAnalytics();
```

#### useWebVitals
**Purpose**: Monitors Core Web Vitals for performance optimization
**Business Value**: Ensures optimal user experience and SEO rankings
**Metrics**: LCP, FID, CLS, FCP, TTFB tracking

#### useMemoryMonitor
**Purpose**: Tracks JavaScript memory usage and prevents memory leaks
**Business Value**: Maintains application stability and performance
**Monitoring**: Heap usage, memory warnings, leak detection

### SEO Optimization Hooks (`useSEO.ts`)

#### useSEO
**Purpose**: Dynamic meta tag management and SEO optimization
**Business Value**: Improves search engine visibility and social media sharing
**Features**: Title, description, keywords, Open Graph, Twitter Cards

```typescript
useSEO({
  title: 'Professional Barber Services',
  description: 'Premium haircuts and styling services',
  keywords: ['barber', 'haircut', 'styling']
});
```

#### useStructuredData
**Purpose**: Manages JSON-LD structured data for rich snippets
**Business Value**: Enhanced search results and local business visibility
**Schema Types**: LocalBusiness, Service, Review, Organization

## 🏗️ Hook Architecture Patterns

### State Management Pattern
```typescript
interface HookState {
  readonly data: BusinessEntity | null;
  readonly loading: boolean;
  readonly error: AppError | null;
}

const useBusinessLogic = () => {
  const [state, setState] = useState<HookState>({
    data: null,
    loading: false,
    error: null
  });

  // Immutable state updates
  const updateState = useCallback((updates: Partial<HookState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  return { state, updateState };
};
```

### Side Effect Management
```typescript
const useAsyncOperation = () => {
  const [data, setData] = useState<Data | null>(null);
  
  useEffect(() => {
    let isCancelled = false;
    
    performAsyncOperation()
      .then(result => {
        if (!isCancelled) {
          setData(result);
        }
      })
      .catch(error => {
        if (!isCancelled) {
          handleError(error);
        }
      });
    
    return () => {
      isCancelled = true;
    };
  }, []);
  
  return data;
};
```

### Performance Optimization
```typescript
const useOptimizedCallback = () => {
  const expensiveOperation = useCallback(
    (param: string) => {
      // Expensive computation
      return processData(param);
    },
    [] // Empty dependency array for stable reference
  );

  const memoizedValue = useMemo(
    () => computeExpensiveValue(data),
    [data] // Only recompute when data changes
  );

  return { expensiveOperation, memoizedValue };
};
```

## 🔧 Business Logic Integration

### Service Layer Integration
```typescript
const useBookingService = () => {
  const { trackEvent } = useAnalytics();
  const { startRender, endRender } = usePerformanceMonitor('BookingService');

  const submitBooking = useCallback(async (booking: BookingDetails) => {
    startRender();
    
    try {
      const result = await bookingService.create(booking);
      trackEvent('booking_submitted', { service: booking.service.name });
      return result;
    } catch (error) {
      trackEvent('booking_error', { error: error.message });
      throw error;
    } finally {
      endRender();
    }
  }, [trackEvent, startRender, endRender]);

  return { submitBooking };
};
```

### Context Integration
```typescript
const useAppContext = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  
  return context;
};
```

## 📊 Performance Monitoring Strategy

### Development Monitoring
- **Render Time Tracking**: Identifies slow components
- **Memory Usage Monitoring**: Prevents memory leaks
- **Console Logging**: Detailed development insights
- **Performance Warnings**: Proactive optimization alerts

### Production Analytics
- **User Behavior Tracking**: Business intelligence data
- **Performance Metrics**: Web Vitals monitoring
- **Error Tracking**: Production issue identification
- **A/B Testing**: Feature effectiveness measurement

## 🧪 Testing Strategy

### Hook Testing Patterns
```typescript
import { renderHook, act } from '@testing-library/react';
import { useBusinessLogic } from './useBusinessLogic';

describe('useBusinessLogic', () => {
  test('should initialize with correct default state', () => {
    const { result } = renderHook(() => useBusinessLogic());
    
    expect(result.current.state.data).toBeNull();
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.error).toBeNull();
  });

  test('should handle async operations correctly', async () => {
    const { result } = renderHook(() => useBusinessLogic());
    
    await act(async () => {
      await result.current.performOperation();
    });
    
    expect(result.current.state.loading).toBe(false);
    expect(result.current.state.data).toBeDefined();
  });
});
```

### Performance Testing
- **Render Count Monitoring**: Prevents unnecessary re-renders
- **Memory Leak Detection**: Ensures proper cleanup
- **Async Operation Testing**: Handles race conditions
- **Error Boundary Integration**: Graceful error handling

## 🎯 Best Practices

### Hook Design Principles
1. **Single Responsibility**: One business concern per hook
2. **Immutable Updates**: Always return new state objects
3. **Dependency Management**: Minimize hook dependencies
4. **Error Handling**: Comprehensive error boundaries
5. **Performance Monitoring**: Built-in performance tracking

### Code Quality Standards
```typescript
// ✅ Good: Clear interface, single responsibility
interface UseBookingResult {
  readonly bookings: Booking[];
  readonly loading: boolean;
  readonly error: AppError | null;
  readonly submitBooking: (booking: BookingDetails) => Promise<Booking>;
  readonly cancelBooking: (id: string) => Promise<void>;
}

const useBooking = (): UseBookingResult => {
  // Implementation following clean code principles
};
```

### Memory Management
- **Cleanup Functions**: Always cleanup side effects
- **Stable References**: Use useCallback for stable function references
- **Memoization**: useMemo for expensive computations
- **Dependency Arrays**: Accurate dependency tracking

## 🔗 Dependencies

### Internal Dependencies
- `../types`: TypeScript interfaces and types
- `../services`: Business logic services
- `../utils`: Utility functions
- `../constants`: Configuration constants

### External Dependencies
- **React**: Hooks and lifecycle management
- **Performance API**: Browser performance monitoring
- **Analytics Services**: User behavior tracking

## 🚀 Integration Examples

### Component Integration
```typescript
const BookingPage: React.FC = () => {
  const { submitBooking, loading, error } = useBooking();
  const { trackPageView } = useAnalytics();
  
  useEffect(() => {
    trackPageView('booking_page');
  }, [trackPageView]);

  useSEO({
    title: 'Book Your Appointment - MP Barbers',
    description: 'Schedule your professional barber service appointment'
  });

  return (
    <div>
      {/* Component implementation */}
    </div>
  );
};
```

### Service Integration
```typescript
const useBookingWithAnalytics = () => {
  const { submitBooking } = useBooking();
  const { trackEvent } = useAnalytics();
  const { startRender, endRender } = usePerformanceMonitor('BookingSubmission');

  const enhancedSubmitBooking = useCallback(async (booking: BookingDetails) => {
    startRender();
    trackEvent('booking_attempt', { service: booking.service.name });
    
    try {
      const result = await submitBooking(booking);
      trackEvent('booking_success', { service: booking.service.name });
      return result;
    } catch (error) {
      trackEvent('booking_error', { error: error.message });
      throw error;
    } finally {
      endRender();
    }
  }, [submitBooking, trackEvent, startRender, endRender]);

  return { submitBooking: enhancedSubmitBooking };
};
```

---

**Next Steps**: Explore [Services Documentation](../services/README.md) for external API integration patterns.