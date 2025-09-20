/**
 * Navigation Component Tests
 * Improving coverage from 50% to target 85%+
 * Targeting uncovered lines: 17,21-23,39-40,54,99
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '../../../contexts/AppContext';
import Navigation from '../Navigation';

// Mock the app context
const mockSetActiveTab = jest.fn();
const mockToggleMobileMenu = jest.fn();
const mockUseApp = jest.fn();

jest.mock('../../../contexts/AppContext', () => ({
  useApp: (...args: any[]) => mockUseApp(...args),
  AppProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>
    {children}
  </div>
);

describe('Navigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation
    mockUseApp.mockReturnValue({
      state: {
        activeTab: 'home',
        mobileMenuOpen: false
      },
      setActiveTab: mockSetActiveTab,
      toggleMobileMenu: mockToggleMobileMenu
    });
  });

  test('renders navigation with logo', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );
    
    expect(screen.getByAltText('MP Barbershop - Sharp Looks, Clean Cuts')).toBeInTheDocument();
    expect(screen.getByLabelText('MP Barbers - Go to home page')).toBeInTheDocument();
  });

  test('renders desktop navigation items', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );
    
    // Should render navigation items (assuming standard nav items)
    const navButtons = screen.getAllByRole('button');
    expect(navButtons.length).toBeGreaterThan(1);
  });

  test('handles logo click navigation', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );
    
    const logo = screen.getByAltText('MP Barbershop - Sharp Looks, Clean Cuts');
    await user.click(logo);
    
    expect(mockSetActiveTab).toHaveBeenCalledWith('home');
  });


  test('shows mobile menu button on mobile', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );
    
    const mobileMenuButton = screen.getByLabelText('Open menu');
    expect(mobileMenuButton).toBeInTheDocument();
  });

  test('handles mobile menu toggle', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );
    
    const mobileMenuButton = screen.getByLabelText('Open menu');
    await user.click(mobileMenuButton);
    
    expect(mockToggleMobileMenu).toHaveBeenCalled();
  });

  test('shows correct mobile menu button text when closed', () => {
    mockUseApp.mockReturnValue({
      state: { activeTab: 'home', mobileMenuOpen: false },
      setActiveTab: mockSetActiveTab,
      toggleMobileMenu: mockToggleMobileMenu
    });
    
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );
    
    expect(screen.getByText('☰')).toBeInTheDocument();
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  test('shows correct mobile menu button text when open', () => {
    mockUseApp.mockReturnValue({
      state: { activeTab: 'home', mobileMenuOpen: true },
      setActiveTab: mockSetActiveTab,
      toggleMobileMenu: mockToggleMobileMenu
    });
    
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );
    
    expect(screen.getByText('✕')).toBeInTheDocument();
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
  });

  test('shows mobile menu when open', () => {
    mockUseApp.mockReturnValue({
      state: { activeTab: 'home', mobileMenuOpen: true },
      setActiveTab: mockSetActiveTab,
      toggleMobileMenu: mockToggleMobileMenu
    });
    
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );
    
    const mobileMenu = screen.getByRole('button', { name: /close menu/i }).closest('nav')?.querySelector('#mobile-menu');
    expect(mobileMenu).toBeInTheDocument();
    expect(mobileMenu).not.toHaveAttribute('aria-hidden', 'true');
  });

  test('hides mobile menu when closed', () => {
    mockUseApp.mockReturnValue({
      state: { activeTab: 'home', mobileMenuOpen: false },
      setActiveTab: mockSetActiveTab,
      toggleMobileMenu: mockToggleMobileMenu
    });
    
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );
    
    const mobileMenu = screen.getByRole('button', { name: /open menu/i }).closest('nav')?.querySelector('#mobile-menu');
    expect(mobileMenu).toBeInTheDocument();
    expect(mobileMenu).toHaveAttribute('aria-hidden', 'true');
  });

  test('highlights active navigation item', () => {
    mockUseApp.mockReturnValue({
      state: { activeTab: 'about', mobileMenuOpen: false },
      setActiveTab: mockSetActiveTab,
      toggleMobileMenu: mockToggleMobileMenu
    });
    
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );
    
    // Find buttons with aria-current="page" which indicates active state
    const activeButtons = screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-current') === 'page'
    );
    
    expect(activeButtons.length).toBeGreaterThan(0);
  });

  test('handles navigation item clicks', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );
    
    // Find navigation buttons (excluding logo and mobile menu button)
    const navButtons = screen.getAllByRole('button').filter(button =>
      !button.getAttribute('aria-label')?.includes('MP Barbers') &&
      !button.textContent?.includes('☰') &&
      !button.textContent?.includes('✕')
    );
    
    if (navButtons.length > 0) {
      await user.click(navButtons[0]);
      expect(mockSetActiveTab).toHaveBeenCalled();
    }
  });

  test('handles mobile navigation item clicks', async () => {
    mockUseApp.mockReturnValue({
      state: { activeTab: 'home', mobileMenuOpen: true },
      setActiveTab: mockSetActiveTab,
      toggleMobileMenu: mockToggleMobileMenu
    });
    
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );
    
    // Mobile menu should be visible and have navigation items
    const mobileNavButtons = screen.getAllByRole('button').filter(button =>
      !button.getAttribute('aria-label')?.includes('MP Barbers') &&
      !button.textContent?.includes('✕')
    );
    
    if (mobileNavButtons.length > 0) {
      await user.click(mobileNavButtons[0]);
      expect(mockSetActiveTab).toHaveBeenCalled();
    }
  });
});
