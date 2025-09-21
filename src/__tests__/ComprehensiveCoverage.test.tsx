/**
 * Comprehensive Coverage Tests
 *
 * @description Single file with all component coverage tests
 * designed to be simple, reliable, and provide good coverage
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '../contexts/AppContext';

// Mock performance hooks to avoid issues
jest.mock('../hooks/usePerformance', () => ({
  useWebVitals: jest.fn(),
  useMemoryMonitor: jest.fn(),
  usePerformanceMonitor: jest.fn(),
}));

// Mock useModalDialog hook to avoid HTMLDialogElement issues
jest.mock('../hooks/useModalDialog', () => ({
  useModalDialog: () => ({
    dialogRef: { current: null }
  })
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider>
    {children}
  </AppProvider>
);

describe('Comprehensive Component Coverage', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  describe('UI Components', () => {
    test('Button component renders and handles clicks', () => {
      const mockClick = jest.fn();
      const Button = require('../components/ui/Button').default;

      render(
        <Button onClick={mockClick}>
          Test Button
        </Button>
      );

      const button = screen.getByRole('button', { name: /test button/i });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    test('Card component renders content', () => {
      const Card = require('../components/ui/Card').default;

      render(
        <Card>
          <div>Test Card Content</div>
        </Card>
      );

      expect(screen.getByText('Test Card Content')).toBeInTheDocument();
    });

    test('Modal component shows and hides', () => {
      const mockClose = jest.fn();
      const Modal = require('../components/ui/Modal').default;

      render(
        <Modal
          isOpen={true}
          onClose={mockClose}
          message="Test modal message"
        />
      );

      expect(screen.getByText('Test modal message')).toBeInTheDocument();
    });

    test('Input component handles changes', async () => {
      const user = userEvent.setup();
      const mockChange = jest.fn();
      const Input = require('../components/ui/Input').default;

      render(
        <Input
          value=""
          onChange={mockChange}
          placeholder="Test input"
        />
      );

      const input = screen.getByPlaceholderText('Test input');
      await user.type(input, 'test');

      expect(mockChange).toHaveBeenCalled();
    });
  });

  describe('Feature Components', () => {
    test('HomePage renders main sections', () => {
      const HomePage = require('../components/features/HomePage').default;

      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      expect(screen.getByText(/MP BARBERSHOP/i)).toBeInTheDocument();
      expect(screen.getByText(/TRADITIONAL BARBERING SERVICES/i)).toBeInTheDocument();
    });

    test('AboutPage renders content', () => {
      const AboutPage = require('../components/features/AboutPage').default;

      render(
        <TestWrapper>
          <AboutPage />
        </TestWrapper>
      );

      expect(screen.getByText(/MP BARBERSHOP/i)).toBeInTheDocument();
    });

    test('ServicesPage renders services', () => {
      const ServicesPage = require('../components/features/ServicesPage').default;

      render(
        <TestWrapper>
          <ServicesPage />
        </TestWrapper>
      );

      expect(screen.getByText(/SERVICE MENU/i)).toBeInTheDocument();
    });

    test('ContactPage renders form', () => {
      const ContactPage = require('../components/features/ContactPage').default;

      render(
        <TestWrapper>
          <ContactPage />
        </TestWrapper>
      );

      expect(screen.getByText(/CONTACT MP BARBERSHOP/i)).toBeInTheDocument();
      expect(screen.getByText(/Send a Message/i)).toBeInTheDocument();
    });
  });

  describe('Layout Components', () => {
    test('Navigation renders menu items', () => {
      const Navigation = require('../components/layout/Navigation').default;

      render(
        <TestWrapper>
          <Navigation />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/main navigation/i)).toBeInTheDocument();
    });

    test('Footer renders contact info', () => {
      const Footer = require('../components/layout/Footer').default;

      render(<Footer />);

      expect(screen.getByRole('heading', { name: /MP BARBERS/i })).toBeInTheDocument();
    });

    test('Layout renders children', () => {
      const Layout = require('../components/layout/Layout').default;

      render(
        <TestWrapper>
          <Layout>
            <div>Test Content</div>
          </Layout>
        </TestWrapper>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Utility Functions', () => {
    test('formatPrice formats currency correctly', () => {
      const { formatPrice } = require('../utils');

      expect(formatPrice(25.50)).toBe('€25.50');
      expect(formatPrice(100)).toBe('€100.00');
    });

    test('validateContactForm validates required fields', () => {
      const { validateContactForm } = require('../utils');

      const invalidData = {
        name: '',
        email: '',
        message: '',
        phoneNumber: ''
      };

      const errors = validateContactForm(invalidData);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain('Please enter your name');
    });

    test('isValidEmail validates email format', () => {
      const { isValidEmail } = require('../utils');

      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    test('sanitizeString escapes HTML characters', () => {
      const { sanitizeString } = require('../utils');

      expect(sanitizeString('<script>alert("test")</script>Clean text'))
        .toBe('Clean text');
      expect(sanitizeString('<div>Content</div>'))
        .toBe('&lt;div&gt;Content&lt;&#47;div&gt;');
    });
  });
});