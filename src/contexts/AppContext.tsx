import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { NavigationTab, ContactFormData } from '../types';

/**
 * Application State Interface
 * 
 * @description Defines the complete application state structure with immutable properties.
 * Centralizes all global state management including navigation, form data, loading states,
 * and error handling for consistent state management across the application.
 */
interface AppState {
  readonly activeTab: NavigationTab;
  readonly mobileMenuOpen: boolean;
  readonly contactData: ContactFormData;
  readonly loading: boolean;
  readonly error: string | null;
}

/**
 * Application Action Types
 * 
 * @description Defines all possible state mutations using discriminated union types.
 * Ensures type safety for state updates and provides clear action interfaces
 * for all application state modifications.
 */
type AppAction =
  | { type: 'SET_ACTIVE_TAB'; payload: NavigationTab }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'CLOSE_MOBILE_MENU' }
  | { type: 'UPDATE_CONTACT_DATA'; payload: Partial<ContactFormData> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_CONTACT_DATA' };

/**
 * Initial Application State
 * 
 * @description Defines the default state values for application initialization.
 * Provides clean starting point with empty form data and inactive UI states
 * for consistent application bootstrap behavior.
 */
const initialState: AppState = {
  activeTab: 'home',
  mobileMenuOpen: false,
  contactData: {
    name: '',
    email: '',
    phoneNumber: '',
    message: '',
  },
  loading: false,
  error: null,
};

/**
 * Application State Reducer
 * 
 * @description Pure function that handles all state transitions based on dispatched actions.
 * Implements immutable state updates following Redux patterns for predictable state management
 * and time-travel debugging capability.
 * 
 * @param state - Current application state
 * @param action - Action to process
 * @returns New state object with immutable updates
 */
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
        mobileMenuOpen: false,
      };
    
    case 'TOGGLE_MOBILE_MENU':
      return {
        ...state,
        mobileMenuOpen: !state.mobileMenuOpen,
      };
    
    case 'CLOSE_MOBILE_MENU':
      return {
        ...state,
        mobileMenuOpen: false,
      };
    
    case 'UPDATE_CONTACT_DATA':
      return {
        ...state,
        contactData: {
          ...state.contactData,
          ...action.payload,
        },
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    
    case 'RESET_CONTACT_DATA':
      return {
        ...state,
        contactData: initialState.contactData,
      };
    
    default:
      return state;
  }
};

/**
 * Application Context Value Interface
 * 
 * @description Defines the context API surface with state and action methods.
 * Provides type-safe interface for components consuming the application context
 * with clear method signatures and immutable state access.
 */
interface AppContextValue {
  readonly state: AppState;
  readonly setActiveTab: (tab: NavigationTab) => void;
  readonly toggleMobileMenu: () => void;
  readonly closeMobileMenu: () => void;
  readonly updateContactData: (data: Partial<ContactFormData>) => void;
  readonly setLoading: (loading: boolean) => void;
  readonly setError: (error: string | null) => void;
  readonly resetContactData: () => void;
}

/**
 * Application Context
 * 
 * @description React Context for global state management across the application.
 * Provides centralized state without prop drilling while maintaining type safety
 * and performance optimization through memoized action creators.
 */
const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  readonly children: React.ReactNode;
}

/**
 * Application Context Provider
 * 
 * @description Provides global state management to the entire application tree.
 * Implements useReducer pattern with memoized action creators for optimal performance
 * and prevents unnecessary re-renders through callback memoization.
 * 
 * @param children - Child components that will have access to the context
 * @returns Context provider component with state management
 * 
 * @example
 * ```tsx
 * <AppProvider>
 *   <App />
 * </AppProvider>
 * ```
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  /**
   * Sets the active navigation tab
   * @description Updates the current active tab and automatically closes mobile menu
   * for better mobile user experience and navigation flow
   */
  const setActiveTab = useCallback((tab: NavigationTab): void => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  }, []);

  /**
   * Toggles mobile menu visibility
   * @description Controls mobile navigation menu state for responsive design
   */
  const toggleMobileMenu = useCallback((): void => {
    dispatch({ type: 'TOGGLE_MOBILE_MENU' });
  }, []);

  /**
   * Closes mobile menu
   * @description Explicitly closes mobile menu, used for outside clicks or navigation
   */
  const closeMobileMenu = useCallback((): void => {
    dispatch({ type: 'CLOSE_MOBILE_MENU' });
  }, []);

  /**
   * Updates contact form data
   * @description Merges partial contact data updates for form state management
   */
  const updateContactData = useCallback((data: Partial<ContactFormData>): void => {
    dispatch({ type: 'UPDATE_CONTACT_DATA', payload: data });
  }, []);

  /**
   * Sets global loading state
   * @description Controls application-wide loading indicators for async operations
   */
  const setLoading = useCallback((loading: boolean): void => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  /**
   * Sets global error state
   * @description Manages application-wide error messages and automatically disables loading
   */
  const setError = useCallback((error: string | null): void => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  /**
   * Resets contact form data to initial state
   * @description Clears all contact form data after successful submission
   */
  const resetContactData = useCallback((): void => {
    dispatch({ type: 'RESET_CONTACT_DATA' });
  }, []);

  const value: AppContextValue = {
    state,
    setActiveTab,
    toggleMobileMenu,
    closeMobileMenu,
    updateContactData,
    setLoading,
    setError,
    resetContactData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Application Context Hook
 * 
 * @description Custom hook for accessing application context with type safety.
 * Provides automatic error checking to ensure hook is used within provider
 * and returns typed context value for component consumption.
 * 
 * @returns Application context value with state and methods
 * @throws Error if used outside of AppProvider
 * 
 * @example
 * ```tsx
 * const MyComponent: React.FC = () => {
 *   const { state, setActiveTab, updateBookingData } = useApp();
 *   
 *   return (
 *     <div>
 *       <p>Current tab: {state.activeTab}</p>
 *       <button onClick={() => setActiveTab('booking')}>
 *         Go to Booking
 *       </button>
 *     </div>
 *   );
 * };
 * ```
 */
export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};