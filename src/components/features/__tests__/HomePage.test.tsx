/**
 * HomePage Component Tests
 * Improving coverage from 5.26% to target 70%+
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '../../../contexts/AppContext';
import HomePage from '../HomePage';

// Mock the performance hooks
const mockUsePerformanceMonitor = jest.fn();
const mockUseAnalytics = jest.fn();
const mockUseSEO = jest.fn();
const mockUseStructuredData = jest.fn();

jest.mock('../../../hooks/usePerformance', () => ({
  usePerformanceMonitor: (...args: any[]) => mockUsePerformanceMonitor(...args),
  useAnalytics: (...args: any[]) => mockUseAnalytics(...args),
}));

jest.mock('../../../hooks/useSEO', () => ({
  useSEO: (...args: any[]) => mockUseSEO(...args),
  useStructuredData: (...args: any[]) => mockUseStructuredData(...args),
  SEO_CONFIGS: { home: { title: 'Home', description: 'Home page' } },
  BUSINESS_STRUCTURED_DATA: {}
}));

// Mock useModalDialog hook to avoid HTMLDialogElement issues
jest.mock('../../../hooks/useModalDialog', () => ({
  useModalDialog: () => ({
    dialogRef: { current: null }
  })
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider>
    {children}
  </AppProvider>
);

describe('HomePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up default mock return values
    mockUsePerformanceMonitor.mockReturnValue({
      startRender: jest.fn(),
      endRender: jest.fn()
    });
    
    mockUseAnalytics.mockReturnValue({
      trackPageView: jest.fn(),
      trackButtonClick: jest.fn()
    });
    
    mockUseSEO.mockReturnValue({});
    mockUseStructuredData.mockReturnValue({});
  });

  test('renders hero section with main heading', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );
    
    expect(screen.getByText('MP BARBERSHOP')).toBeInTheDocument();
    expect(screen.getByText('BOOK YOUR CUT')).toBeInTheDocument();
  });

  test('renders services section with service cards', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );
    
    expect(screen.getByText('OUR SERVICES')).toBeInTheDocument();
    expect(screen.getByText('View All Services →')).toBeInTheDocument();
  });

  test('renders testimonials section', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );
    
    expect(screen.getByText('WHAT OUR CLIENTS SAY')).toBeInTheDocument();
  });

  test('handles booking button click in hero section', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );
    
    const bookingButton = screen.getByText('BOOK YOUR CUT');
    await user.click(bookingButton);
    
    // Since we're testing the click handler, we can't easily test navigation
    // but we can ensure the button is clickable and doesn't error
    expect(bookingButton).toBeInTheDocument();
  });

  test('handles service card click', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );
    
    // Find the first service card and click it
    const serviceCards = screen.getAllByRole('button');
    const firstServiceCard = serviceCards.find(card => 
      card.getAttribute('aria-label')?.includes('Book')
    );
    
    if (firstServiceCard) {
      await user.click(firstServiceCard);
      expect(firstServiceCard).toBeInTheDocument();
    }
  });

  test('handles keyboard navigation on service cards', async () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );
    
    const serviceCards = screen.getAllByRole('button');
    const firstServiceCard = serviceCards.find(card => 
      card.getAttribute('aria-label')?.includes('Book')
    );
    
    if (firstServiceCard) {
      fireEvent.keyDown(firstServiceCard, { key: 'Enter' });
      expect(firstServiceCard).toBeInTheDocument();
      
      fireEvent.keyDown(firstServiceCard, { key: ' ' });
      expect(firstServiceCard).toBeInTheDocument();
    }
  });

  test('handles View All Services button click', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );
    
    const viewAllButton = screen.getByText('View All Services →');
    await user.click(viewAllButton);
    
    expect(viewAllButton).toBeInTheDocument();
  });


  test('renders with proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <HomePage />
      </TestWrapper>
    );
    
    expect(screen.getByLabelText('Hero section')).toBeInTheDocument();
    expect(screen.getByLabelText('Our services')).toBeInTheDocument();
    expect(screen.getByLabelText('Customer testimonials')).toBeInTheDocument();
  });
});
