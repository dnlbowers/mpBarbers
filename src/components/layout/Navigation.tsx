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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to text if image fails to load
    const target = event.target as HTMLImageElement;
    target.style.display = 'none';
    
    // Create fallback button element
    const fallback = document.createElement('button');
    fallback.textContent = 'MP BARBERS';
    fallback.className = 'text-2xl font-bold text-gray-900 bg-transparent border-0 cursor-pointer';
    fallback.onclick = () => handleNavigation('home');
    fallback.setAttribute('aria-label', 'MP Barbers - Go to home page');
    
    target.parentElement?.appendChild(fallback);
  };

  return (
    <nav
      className="fixed top-0 w-full bg-white shadow-sm z-50"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('home')}
              className="p-0 border-0 bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
              aria-label="MP Barbers - Go to home page"
            >
              <img
                src="/images/nav/logo-fullsize.webp"
                alt="MP Barbershop - Sharp Looks, Clean Cuts"
                className="h-12 w-auto max-w-[180px] transition-opacity duration-200 hover:opacity-90 md:h-16 md:max-w-[280px]"
                onError={handleImageError}
                loading="eager"
              />
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavigation(item.key)}
                className={cn(
                  'relative text-gray-700 hover:text-gray-900 transition-all duration-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500',
                  activeTab === item.key && 'text-gray-900 font-semibold'
                )}
                aria-label={item.ariaLabel}
                aria-current={activeTab === item.key ? 'page' : undefined}
              >
                {item.label}
                {activeTab === item.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
                )}
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
        data-testid="mobile-menu"
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
                'block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 border-l-4 border-transparent',
                activeTab === item.key && 'text-gray-900 font-semibold bg-gray-50 border-l-gray-900'
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
