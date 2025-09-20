/**
 * App Component Tests
 * Improving coverage from 12.5% to target 70%+
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock all the complex dependencies
jest.mock('../contexts/AppContext', () => ({
  AppProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useApp: jest.fn()
}));

jest.mock('../components/layout/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

jest.mock('../components/ui/ErrorBoundary', () => {
  return function MockErrorBoundary({ children }: { children: React.ReactNode }) {
    return <div data-testid="error-boundary">{children}</div>;
  };
});

jest.mock('../components/features/HomePage', () => {
  return function MockHomePage() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('../components/features/AboutPage', () => {
  return function MockAboutPage() {
    return <div data-testid="about-page">About Page</div>;
  };
});

jest.mock('../components/features/ServicesPage', () => {
  return function MockServicesPage() {
    return <div data-testid="services-page">Services Page</div>;
  };
});

jest.mock('../components/features/ContactPage', () => {
  return function MockContactPage() {
    return <div data-testid="contact-page">Contact Page</div>;
  };
});

jest.mock('../hooks/usePerformance', () => ({
  useWebVitals: jest.fn(),
  useMemoryMonitor: jest.fn()
}));

describe('App Component', () => {
  let App: React.ComponentType;
  let mockUseApp: jest.Mock;
  let mockUseWebVitals: jest.Mock;
  let mockUseMemoryMonitor: jest.Mock;

  beforeEach(() => {
    App = require('../App').default;
    mockUseApp = require('../contexts/AppContext').useApp;
    mockUseWebVitals = require('../hooks/usePerformance').useWebVitals;
    mockUseMemoryMonitor = require('../hooks/usePerformance').useMemoryMonitor;

    // Set default mock return value
    mockUseApp.mockReturnValue({
      state: { activeTab: 'home' }
    });

    jest.clearAllMocks();
  });

  test('renders app with default home page', () => {
    render(<App />);
    
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getAllByTestId('error-boundary')).toHaveLength(2); // One outer, one inner
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('renders about page when active tab is about', () => {
    mockUseApp.mockReturnValue({
      state: { activeTab: 'about' }
    });
    
    render(<App />);
    
    expect(screen.getByTestId('about-page')).toBeInTheDocument();
    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
  });

  test('renders services page when active tab is services', () => {
    mockUseApp.mockReturnValue({
      state: { activeTab: 'services' }
    });

    render(<App />);

    expect(screen.getByTestId('services-page')).toBeInTheDocument();
    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
  });

  test('renders contact page when active tab is contact', () => {
    mockUseApp.mockReturnValue({
      state: { activeTab: 'contact' }
    });
    
    render(<App />);
    
    expect(screen.getByTestId('contact-page')).toBeInTheDocument();
    expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
  });

  test('renders home page for unknown tab', () => {
    mockUseApp.mockReturnValue({
      state: { activeTab: 'unknown' }
    });
    
    render(<App />);
    
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });


  test('has error boundary with proper structure', () => {
    // Ensure mock is set up properly
    mockUseApp.mockReturnValue({
      state: { activeTab: 'home' }
    });
    
    render(<App />);
    
    // Should have nested error boundaries (outer App level + inner Layout level)
    const errorBoundaries = screen.getAllByTestId('error-boundary');
    expect(errorBoundaries.length).toBeGreaterThan(1);
  });
});
