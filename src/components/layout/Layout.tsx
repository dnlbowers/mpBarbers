/**
 * Main Layout Component - Root layout wrapper
 * Provides consistent structure for all pages
 */

import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import type { BaseComponentProps } from '../../types';

interface LayoutProps extends BaseComponentProps {
  readonly skipToMain?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  skipToMain = true,
  className = '',
  ...props 
}) => {
  const handleSkipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen bg-white ${className}`} {...props}>
      {/* Skip to main content link for accessibility */}
      {skipToMain && (
        <a
          href="#main-content"
          onClick={(e) => {
            e.preventDefault();
            handleSkipToMain();
          }}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                     bg-gray-900 text-white px-4 py-2 rounded-md z-50 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
        >
          Skip to main content
        </a>
      )}
      
      <Navigation />
      
      <main 
        id="main-content"
        role="main"
        tabIndex={-1}
        className="focus:outline-none pt-16 md:pt-20"
      >
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
