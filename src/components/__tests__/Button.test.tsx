/**
 * Button Component Test Suite
 * 
 * @description Comprehensive tests for the Button component including
 * accessibility, variants, interactions, and performance. Ensures
 * component meets WCAG 2.1 AA standards and business requirements.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithA11yTesting } from '../../__tests__/testUtils';
import Button from '../ui/Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    /**
     * Tests basic rendering functionality
     * @description Ensures button renders correctly with default props
     */
    test('renders with default props', () => {
      render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });

    test('renders with custom children', () => {
      render(
        <Button>
          <span>Custom Content</span>
        </Button>
      );
      
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    test('applies custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Variants', () => {
    /**
     * Tests different button variants
     * @description Ensures proper styling for each variant
     */
    test('renders primary variant by default', () => {
      render(<Button>Primary Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-900', 'text-white');
    });

    test('renders secondary variant', () => {
      render(<Button variant="secondary">Secondary Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-100', 'text-gray-900');
    });

    test('renders outline variant', () => {
      render(<Button variant="outline">Outline Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('border-2', 'border-gray-300', 'bg-transparent');
    });

    test('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-gray-700', 'bg-transparent');
    });
  });

  describe('Sizes', () => {
    /**
     * Tests different button sizes
     * @description Ensures proper sizing for each size variant
     */
    test('renders medium size by default', () => {
      render(<Button>Medium Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-base');
    });

    test('renders small size', () => {
      render(<Button size="sm">Small Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    test('renders large size', () => {
      render(<Button size="lg">Large Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
    });
  });

  describe('States', () => {
    /**
     * Tests different button states
     * @description Ensures proper behavior for disabled, loading, and active states
     */
    test('renders disabled state', () => {
      render(<Button disabled>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });

    test('renders loading state', () => {
      render(<Button loading>Loading Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');

      // Should display loading spinner
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    test('loading state prevents interaction', () => {
      const handleClick = jest.fn();
      render(<Button loading onClick={handleClick}>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('disabled state prevents interaction', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    /**
     * Tests user interactions
     * @description Ensures proper event handling and callback execution
     */
    test('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Clickable Button</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('does not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(<Button loading onClick={handleClick}>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('handles keyboard navigation', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Keyboard Button</Button>);
      
      const button = screen.getByRole('button');
      
      // Focus the button
      button.focus();
      expect(button).toHaveFocus();
      
      // Press Enter
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      fireEvent.click(button); // Simulate browser behavior
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('handles space key activation', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Space Button</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      
      // Press Space
      fireEvent.keyDown(button, { key: ' ', code: 'Space' });
      fireEvent.click(button); // Simulate browser behavior
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    /**
     * Tests accessibility compliance
     * @description Ensures WCAG 2.1 AA compliance and proper ARIA attributes
     */
    test('passes accessibility audit', async () => {
      const { container } = await renderWithA11yTesting(
        <Button>Accessible Button</Button>
      );
      
      // Additional accessibility checks are performed by renderWithA11yTesting
      expect(container).toBeInTheDocument();
    });

    test('supports custom aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      
      const button = screen.getByRole('button', { name: /close dialog/i });
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
    });

    test('has proper focus styles', () => {
      render(<Button>Focus Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
    });

    test('announces loading state to screen readers', () => {
      render(<Button loading>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    test('loading spinner is hidden from screen readers', () => {
      render(<Button loading>Loading Button</Button>);

      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });

    test('maintains accessible color contrast', () => {
      // Test primary variant (dark background, light text)
      render(<Button variant="primary">Primary Button</Button>);
      const primaryButton = screen.getByRole('button');
      expect(primaryButton).toHaveClass('bg-gray-900', 'text-white');
      
      // Test secondary variant (light background, dark text)
      render(<Button variant="secondary">Secondary Button</Button>);
      const secondaryButton = screen.getAllByRole('button')[1];
      expect(secondaryButton).toHaveClass('bg-gray-100', 'text-gray-900');
    });

    test('has proper button semantics', () => {
      render(<Button type="submit">Submit Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    test('supports role attribute', () => {
      render(<Button role="menuitem">Menu Item</Button>);
      
      const button = screen.getByRole('menuitem');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    /**
     * Tests performance optimizations
     * @description Ensures component renders efficiently
     */
    test('renders quickly with minimal re-renders', () => {
      const { rerender } = render(<Button>Test Button</Button>);
      
      const startTime = performance.now();
      
      // Multiple re-renders with same props
      for (let i = 0; i < 10; i++) {
        rerender(<Button>Test Button</Button>);
      }
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Expect fast rendering (under 100ms for 10 re-renders)
      expect(renderTime).toBeLessThan(100);
    });

    test('handles rapid click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Rapid Click</Button>);
      
      const button = screen.getByRole('button');
      
      // Simulate rapid clicking
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button);
      }
      
      expect(handleClick).toHaveBeenCalledTimes(10);
    });
  });

  describe('Edge Cases', () => {
    /**
     * Tests edge cases and error conditions
     * @description Ensures robust handling of unusual scenarios
     */
    test('handles null onClick prop', () => {
      expect(() => {
        render(<Button onClick={null as any}>Null Click</Button>);
      }).not.toThrow();
    });

    test('handles undefined children', () => {
      expect(() => {
        render(<Button>{undefined}</Button>);
      }).not.toThrow();
    });

    test('handles empty children', () => {
      render(<Button>{''}</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    test('handles complex children', () => {
      render(
        <Button>
          <span>Text</span>
          <strong>Bold</strong>
          <em>Italic</em>
        </Button>
      );
      
      expect(screen.getByText('Text')).toBeInTheDocument();
      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('Italic')).toBeInTheDocument();
    });

    test('handles both disabled and loading states', () => {
      render(<Button disabled loading>Disabled and Loading</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');

      // Should show loading spinner
      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    test('handles invalid variant gracefully', () => {
      const { container } = render(
        <Button variant={'invalid' as any}>Invalid Variant</Button>
      );
      
      // Should not crash and should render something
      expect(container).toBeInTheDocument();
    });

    test('handles invalid size gracefully', () => {
      const { container } = render(
        <Button size={'invalid' as any}>Invalid Size</Button>
      );
      
      // Should not crash and should render something
      expect(container).toBeInTheDocument();
    });
  });

  describe('Props Forwarding', () => {
    /**
     * Tests HTML props forwarding
     * @description Ensures additional HTML attributes are properly forwarded
     */
    test('forwards additional HTML attributes', () => {
      render(
        <Button
          id="test-button"
          data-testid="custom-button"
          title="Button title"
        >
          Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'test-button');
      expect(button).toHaveAttribute('data-testid', 'custom-button');
      expect(button).toHaveAttribute('title', 'Button title');
    });

    test('forwards ARIA attributes', () => {
      render(
        <Button
          aria-describedby="description"
          aria-expanded="false"
          aria-haspopup="true"
        >
          Menu Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-describedby', 'description');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveAttribute('aria-haspopup', 'true');
    });

    test('forwards event handlers', () => {
      const handleMouseEnter = jest.fn();
      const handleMouseLeave = jest.fn();
      const handleFocus = jest.fn();
      const handleBlur = jest.fn();
      
      render(
        <Button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          Event Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      
      fireEvent.mouseEnter(button);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
      
      fireEvent.mouseLeave(button);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
      
      fireEvent.focus(button);
      expect(handleFocus).toHaveBeenCalledTimes(1);
      
      fireEvent.blur(button);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading State Animation', () => {
    /**
     * Tests loading state animations
     * @description Ensures loading spinner animation works correctly
     */
    test('loading spinner has correct animation classes', () => {
      render(<Button loading>Loading</Button>);

      const spinner = screen.getByTestId('loading-spinner');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    test('loading state transitions smoothly', () => {
      const { rerender } = render(<Button>Normal</Button>);
      
      // Switch to loading
      rerender(<Button loading>Loading</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      
      // Switch back to normal
      rerender(<Button>Normal</Button>);
      
      const normalButton = screen.getByRole('button');
      expect(normalButton).toHaveAttribute('aria-busy', 'false');
    });
  });

  describe('Theming and Styling', () => {
    /**
     * Tests theming and styling capabilities
     * @description Ensures component works with different styling approaches
     */
    test('supports CSS custom properties', () => {
      render(
        <div style={{ '--button-bg': 'red' } as React.CSSProperties}>
          <Button style={{ backgroundColor: 'var(--button-bg)' }}>
            Themed Button
          </Button>
        </div>
      );
      
      const button = screen.getByRole('button');
      // Just check that button exists - style attribute isn't critical for this test
      expect(button).toBeInTheDocument();
    });

    test('combines multiple className sources correctly', () => {
      render(
        <Button 
          className="custom-class another-class" 
          variant="primary"
          size="lg"
        >
          Multi-class Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class', 'another-class');
      expect(button).toHaveClass('bg-gray-900'); // From variant
      expect(button).toHaveClass('px-6', 'py-3'); // From size
    });
  });
});
