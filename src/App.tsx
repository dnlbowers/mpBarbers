/**
 * Main App Component - TypeScript Version with Error Boundaries
 * Clean Architecture with proper separation of concerns
 */

import React from 'react';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/layout/Layout';
import HomePage from './components/features/HomePage';
import AboutPage from './components/features/AboutPage';
import ServicesPage from './components/features/ServicesPage';
import ContactPage from './components/features/ContactPage';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { useApp } from './contexts/AppContext';

// Router component (simplified for this example)
const AppRouter: React.FC = () => {
  const { state } = useApp();
  const { activeTab } = state;

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'services':
        return <ServicesPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout>
      <ErrorBoundary>
        {renderPage()}
      </ErrorBoundary>
    </Layout>
  );
};

// Main App component with providers and error boundaries
const App: React.FC = () => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to error reporting service in production
        console.error('App Error:', error, errorInfo);
      }}
    >
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
