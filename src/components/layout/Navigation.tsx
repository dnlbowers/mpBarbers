/**
 * Navigation Component - Accessible main navigation
 * Responsive design with mobile menu and keyboard navigation
 */

import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { NAVIGATION_ITEMS } from '../../constants';
import Button from '../ui/Button';
import { cn } from '../../utils';

const Navigation: React.FC = () => {
  const { state, setActiveTab, toggleMobileMenu } = useApp();
  const { activeTab, mobileMenuOpen } = state;

  const handleNavigation = (tabKey: string) => {
    setActiveTab(tabKey as any);
  };

  const handleKeyDown = (event: React.KeyboardEvent, tabKey: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(tabKey);
    }
  };

  return (
    <nav 
      className="fixed top-0 w-full bg-white shadow-sm z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 
              className="text-2xl font-bold text-gray-900"
              onClick={() => handleNavigation('home')}
              onKeyDown={(e) => handleKeyDown(e, 'home')}
              tabIndex={0}
              role="button"
              aria-label="MP Barbers - Go to home page"
            >
              MP BARBERS
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavigation(item.key)}
                className={cn(
                  'text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500',
                  activeTab === item.key && 'text-gray-900 font-semibold'
                )}
                aria-label={item.ariaLabel}
                aria-current={activeTab === item.key ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="text-gray-700 text-xl">
              {mobileMenuOpen ? '✕' : '☰'}
            </span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden bg-white border-t transition-all duration-200 ease-in-out',
          mobileMenuOpen 
            ? 'max-h-64 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.key)}
              className={cn(
                'block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500',
                activeTab === item.key && 'text-gray-900 font-semibold bg-gray-50'
              )}
              aria-label={item.ariaLabel}
              aria-current={activeTab === item.key ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
