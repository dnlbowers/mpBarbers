# Contexts Documentation

## 🏛️ State Management Architecture

This directory contains React Context providers that manage global application state following **Clean Architecture** principles. The context layer provides centralized state management without prop drilling while maintaining type safety and performance optimization.

### Design Principles
- **Centralized State**: Single source of truth for global application state
- **Immutable Updates**: All state changes follow immutable patterns
- **Type Safety**: Comprehensive TypeScript integration with strict typing
- **Performance Optimization**: Memoized callbacks and selective re-rendering
- **Error Boundaries**: Proper error handling and context validation

## 📦 Context Architecture

### AppContext (`AppContext.tsx`)

#### Purpose and Responsibility
**Business Logic**: Manages navigation state, form data persistence, loading states, and error handling
**Architecture**: Implements useReducer pattern with Redux-like action dispatching
**Performance**: Memoized action creators prevent unnecessary re-renders

#### State Structure
```typescript
interface AppState {
  readonly activeTab: NavigationTab;        // Current navigation state
  readonly mobileMenuOpen: boolean;         // Mobile UI state
  readonly bookingData: BookingFormData;    // Persistent booking form data
  readonly contactData: ContactFormData;    // Persistent contact form data
  readonly loading: boolean;                // Global loading state
  readonly error: string | null;           // Global error state
}
```

#### Core Capabilities

##### Navigation Management
**Purpose**: Centralized navigation state for consistent routing and mobile experience
**Business Value**: Provides seamless navigation experience across all devices

```typescript
const { setActiveTab, state } = useApp();

// Navigate programmatically
setActiveTab('booking'); // Automatically closes mobile menu

// Access current navigation state
const currentTab = state.activeTab;
```

##### Form State Persistence
**Purpose**: Maintains form data across navigation for improved user experience
**UX Benefit**: Users don't lose form progress when navigating between sections

```typescript
const { updateBookingData, state } = useApp();

// Update booking form progressively
updateBookingData({ 
  service: 'classic-cut',
  date: '2024-03-15' 
});

// Form data persists across navigation
const savedBookingData = state.bookingData;
```

##### Mobile Menu Control
**Purpose**: Manages responsive mobile navigation menu state
**Responsive Design**: Provides smooth mobile experience with proper state management

```typescript
const { toggleMobileMenu, closeMobileMenu } = useApp();

// Toggle mobile menu
const handleMenuButton = () => toggleMobileMenu();

// Close menu on outside click
const handleOutsideClick = () => closeMobileMenu();
```

##### Global Loading States
**Purpose**: Centralized loading state management for consistent UI feedback
**Performance**: Prevents multiple loading indicators and provides unified UX

```typescript
const { setLoading, state } = useApp();

// Set loading state for async operations
const handleBookingSubmit = async () => {
  setLoading(true);
  try {
    await submitBooking(bookingData);
  } finally {
    setLoading(false);
  }
};
```

##### Error State Management
**Purpose**: Centralized error handling and display across the application
**User Experience**: Consistent error messaging and recovery patterns

```typescript
const { setError, state } = useApp();

// Handle and display errors globally
const handleError = (error: Error) => {
  setError(error.message);
  // Error automatically clears loading state
};

// Display error in UI
if (state.error) {
  return <ErrorMessage message={state.error} />;
}
```

## 🏗️ Context Architecture Patterns

### Reducer Pattern Implementation
```typescript
// Action-based state management
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'UPDATE_BOOKING_DATA':
      return {
        ...state,
        bookingData: {
          ...state.bookingData,
          ...action.payload, // Immutable merge
        },
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false, // Auto-clear loading on error
      };
    
    default:
      return state;
  }
};
```

### Performance Optimization
```typescript
// Memoized action creators prevent unnecessary re-renders
const updateBookingData = useCallback((data: Partial<BookingFormData>): void => {
  dispatch({ type: 'UPDATE_BOOKING_DATA', payload: data });
}, []); // Empty dependency array - stable reference

// Context value memoization
const value = useMemo(() => ({
  state,
  setActiveTab,
  updateBookingData,
  // ... other methods
}), [state, setActiveTab, updateBookingData]);
```

### Type-Safe Context Pattern
```typescript
// Strongly typed context interface
interface AppContextValue {
  readonly state: AppState;
  readonly setActiveTab: (tab: NavigationTab) => void;
  readonly updateBookingData: (data: Partial<BookingFormData>) => void;
  // ... other methods with explicit types
}

// Type-safe context hook with error checking
export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
```

## 🔧 Integration Patterns

### Component Integration
```typescript
const BookingPage: React.FC = () => {
  const { 
    state, 
    updateBookingData, 
    setLoading, 
    setError 
  } = useApp();

  const handleServiceSelect = (service: string) => {
    updateBookingData({ service });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitBooking(state.bookingData);
      // Success handling
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {state.loading && <LoadingSpinner />}
      {/* Component implementation */}
    </div>
  );
};
```

### Provider Composition
```typescript
const App: React.FC = () => {
  return (
    <AppProvider>
      <ErrorBoundary>
        <Layout>
          <Router />
        </Layout>
      </ErrorBoundary>
    </AppProvider>
  );
};
```

### Custom Hook Composition
```typescript
// Specialized hooks that use the main context
const useNavigation = () => {
  const { state, setActiveTab } = useApp();
  
  return {
    currentTab: state.activeTab,
    navigate: setActiveTab,
    isActive: (tab: NavigationTab) => state.activeTab === tab
  };
};

const useBookingForm = () => {
  const { state, updateBookingData, resetBookingData } = useApp();
  
  return {
    formData: state.bookingData,
    updateField: (field: keyof BookingFormData, value: string) => {
      updateBookingData({ [field]: value });
    },
    resetForm: resetBookingData,
    isComplete: validateBookingForm(state.bookingData).length === 0
  };
};
```

## 🧪 Testing Strategy

### Context Testing
```typescript
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from './AppContext';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider>{children}</AppProvider>
);

describe('AppContext', () => {
  test('should update booking data correctly', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    act(() => {
      result.current.updateBookingData({ service: 'classic-cut' });
    });
    
    expect(result.current.state.bookingData.service).toBe('classic-cut');
  });

  test('should handle navigation correctly', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    act(() => {
      result.current.setActiveTab('booking');
    });
    
    expect(result.current.state.activeTab).toBe('booking');
    expect(result.current.state.mobileMenuOpen).toBe(false);
  });
});
```

### Integration Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { AppProvider } from './AppContext';
import { BookingPage } from '../components/features/BookingPage';

describe('Context Integration', () => {
  test('should persist form data across navigation', () => {
    render(
      <AppProvider>
        <BookingPage />
      </AppProvider>
    );
    
    // Fill form data
    const serviceSelect = screen.getByRole('combobox', { name: /service/i });
    fireEvent.change(serviceSelect, { target: { value: 'classic-cut' } });
    
    // Navigate away and back
    const homeLink = screen.getByRole('link', { name: /home/i });
    fireEvent.click(homeLink);
    
    const bookingLink = screen.getByRole('link', { name: /booking/i });
    fireEvent.click(bookingLink);
    
    // Verify data persistence
    expect(serviceSelect).toHaveValue('classic-cut');
  });
});
```

### Performance Testing
```typescript
describe('Context Performance', () => {
  test('should not cause unnecessary re-renders', () => {
    let renderCount = 0;
    
    const TestComponent = () => {
      renderCount++;
      const { state } = useApp();
      return <div>{state.activeTab}</div>;
    };
    
    const { rerender } = render(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    
    const initialRenderCount = renderCount;
    
    // Re-render provider without state changes
    rerender(
      <AppProvider>
        <TestComponent />
      </AppProvider>
    );
    
    expect(renderCount).toBe(initialRenderCount);
  });
});
```

## 🎯 Best Practices

### Context Design Principles
1. **Single Responsibility**: Each context manages one domain of state
2. **Immutable Updates**: Always return new state objects
3. **Type Safety**: Comprehensive TypeScript coverage
4. **Performance**: Memoized callbacks and minimal re-renders
5. **Error Handling**: Proper error boundaries and validation

### Optimization Strategies
```typescript
// ✅ Good: Memoized action creators
const updateData = useCallback((data: FormData) => {
  dispatch({ type: 'UPDATE_DATA', payload: data });
}, []); // Stable reference

// ✅ Good: Selective state access
const useSpecificState = () => {
  const { state } = useApp();
  return useMemo(() => ({
    isLoading: state.loading,
    hasError: state.error !== null
  }), [state.loading, state.error]);
};

// ❌ Bad: Destructuring entire state in render
const BadComponent = () => {
  const { state } = useApp();
  return <div>{state.activeTab}</div>; // Re-renders on any state change
};
```

### Context Composition
```typescript
// Multiple specialized contexts instead of one large context
const BookingProvider = ({ children }) => (
  <BookingStateProvider>
    <BookingActionsProvider>
      {children}
    </BookingActionsProvider>
  </BookingStateProvider>
);

// Combined provider for application
const AllProviders = ({ children }) => (
  <AppProvider>
    <BookingProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </BookingProvider>
  </AppProvider>
);
```

## 🔗 Advanced Patterns

### Context with Middleware
```typescript
const withLogging = (reducer: Reducer) => (state: State, action: Action) => {
  console.log('Action:', action);
  const newState = reducer(state, action);
  console.log('New State:', newState);
  return newState;
};

const withDevTools = (reducer: Reducer) => {
  if (process.env.NODE_ENV === 'development') {
    return withLogging(reducer);
  }
  return reducer;
};

// Usage in provider
const [state, dispatch] = useReducer(withDevTools(appReducer), initialState);
```

### Async Context Actions
```typescript
const useAsyncActions = () => {
  const { setLoading, setError } = useApp();
  
  const executeAsync = useCallback(async (asyncOperation: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncOperation();
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);
  
  return { executeAsync };
};
```

### State Persistence
```typescript
const usePersistedState = (key: string, initialState: any) => {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialState;
    } catch {
      return initialState;
    }
  });
  
  const setPersistedState = useCallback((newState: any) => {
    setState(newState);
    try {
      localStorage.setItem(key, JSON.stringify(newState));
    } catch (error) {
      console.warn('Failed to persist state:', error);
    }
  }, [key]);
  
  return [state, setPersistedState];
};
```

## 📊 Context Performance Monitoring

### Performance Metrics
```typescript
const withPerformanceTracking = (WrappedProvider: React.ComponentType) => {
  return ({ children, ...props }) => {
    const [rerenderCount, setRerenderCount] = useState(0);
    
    useEffect(() => {
      setRerenderCount(prev => prev + 1);
    });
    
    useEffect(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`${WrappedProvider.name} re-rendered ${rerenderCount} times`);
      }
    }, [rerenderCount]);
    
    return (
      <WrappedProvider {...props}>
        {children}
      </WrappedProvider>
    );
  };
};

// Usage
export const MonitoredAppProvider = withPerformanceTracking(AppProvider);
```

### Memory Usage Monitoring
```typescript
const useMemoryMonitoring = () => {
  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('Context memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        });
      }
    };
    
    const interval = setInterval(checkMemory, 30000);
    return () => clearInterval(interval);
  }, []);
};
```

## 🚀 Migration and Scaling

### Context Migration Strategies
```typescript
// Version 1: Simple state
interface AppStateV1 {
  readonly activeTab: string;
  readonly loading: boolean;
}

// Version 2: Enhanced state
interface AppStateV2 extends AppStateV1 {
  readonly bookingData: BookingFormData;
  readonly error: string | null;
}

// Migration helper
const migrateState = (oldState: AppStateV1): AppStateV2 => ({
  ...oldState,
  bookingData: initialBookingData,
  error: null
});
```

### Context Splitting Strategy
```typescript
// When context grows too large, split into focused contexts
const NavigationProvider = ({ children }) => {
  // Navigation-specific state and actions
};

const FormProvider = ({ children }) => {
  // Form-specific state and actions
};

const ErrorProvider = ({ children }) => {
  // Error-specific state and actions
};

// Compose providers
const AllProviders = ({ children }) => (
  <NavigationProvider>
    <FormProvider>
      <ErrorProvider>
        {children}
      </ErrorProvider>
    </FormProvider>
  </NavigationProvider>
);
```

---

**Architecture Complete**: This comprehensive documentation system provides a complete reference for the MP Barbers application architecture, following Clean Architecture principles with TypeScript, React, and enterprise-grade patterns.