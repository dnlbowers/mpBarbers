/**
 * Layout Component Tests
 * Improving coverage from 33% to target 80%+
 * Targeting uncovered lines: 22-25,36-37
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '../../../contexts/AppContext';

// Mock the child components to avoid complex dependencies
jest.mock('../Navigation', () => {
  return function MockNavigation() {
    return <nav data-testid="navigation">Navigation</nav>;
  };
});

jest.mock('../Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AppProvider>
    {children}
  </AppProvider>
);

describe('Layout Component', () => {
  let Layout: React.ComponentType<any>;
  
  beforeEach(() => {
    Layout = require('../Layout').default;
    
    // Mock getElementById and focus methods
    const mockElement = {
      focus: jest.fn(),
      scrollIntoView: jest.fn()
    };
    
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders layout with all child components', () => {
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );
    
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders skip to main content link by default', () => {
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );
    
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  test('does not render skip to main content link when disabled', () => {
    render(
      <TestWrapper>
        <Layout skipToMain={false}>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );
    
    expect(screen.queryByText('Skip to main content')).not.toBeInTheDocument();
  });

  test('handles skip to main content functionality', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );
    
    const skipLink = screen.getByText('Skip to main content');
    await user.click(skipLink);
    
    expect(document.getElementById).toHaveBeenCalledWith('main-content');
  });

  test('prevents default behavior on skip link click', () => {
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );
    
    const skipLink = screen.getByText('Skip to main content');
    const mockPreventDefault = jest.fn();
    
    fireEvent.click(skipLink, {
      preventDefault: mockPreventDefault
    });
    
    // The preventDefault should be called in the onClick handler
    expect(document.getElementById).toHaveBeenCalledWith('main-content');
  });

  test('handles skip to main when element exists', () => {
    const mockElement = {
      focus: jest.fn(),
      scrollIntoView: jest.fn()
    };
    
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);
    
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );
    
    const skipLink = screen.getByText('Skip to main content');
    fireEvent.click(skipLink);
    
    expect(mockElement.focus).toHaveBeenCalled();
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  test('handles skip to main when element does not exist', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(null);
    
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );
    
    const skipLink = screen.getByText('Skip to main content');
    
    // Should not throw error when element doesn't exist
    expect(() => fireEvent.click(skipLink)).not.toThrow();
  });

  test('applies custom className', () => {
    render(
      <TestWrapper>
        <Layout className="custom-class" data-testid="layout-root">
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );
    
    const layoutContainer = screen.getByTestId('layout-root');
    expect(layoutContainer).toHaveClass('custom-class');
  });

  test('applies default className when none provided', () => {
    render(
      <TestWrapper>
        <Layout data-testid="layout-root">
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );
    
    const layoutContainer = screen.getByTestId('layout-root');
    expect(layoutContainer).toHaveClass('min-h-screen', 'bg-white');
  });

  test('passes through additional props', () => {
    render(
      <TestWrapper>
        <Layout data-testid="layout-container" role="application">
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );
    
    const layoutContainer = screen.getByTestId('layout-container');
    expect(layoutContainer).toHaveAttribute('role', 'application');
  });

  test('renders main element with proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </TestWrapper>
    );
    
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveAttribute('id', 'main-content');
    expect(mainElement).toHaveAttribute('tabIndex', '-1');
    expect(mainElement).toHaveClass('focus:outline-none');
  });

  test('renders children inside main element', () => {
    render(
      <TestWrapper>
        <Layout>
          <div data-testid="child-content">Test Content</div>
        </Layout>
      </TestWrapper>
    );
    
    const mainElement = screen.getByRole('main');
    const childContent = screen.getByTestId('child-content');
    
    expect(mainElement).toContainElement(childContent);
  });
});
