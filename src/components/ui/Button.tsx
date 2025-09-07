import React from 'react';
import type { ButtonProps } from '../../types';
import { cn } from '../../utils';

/**
 * Accessible Button Component
 * 
 * @description Provides a reusable button component with multiple variants, sizes, and states.
 * Implements WCAG 2.1 AA accessibility standards with full keyboard navigation and screen reader support.
 * 
 * @example
 * ```tsx
 * <Button 
 *   variant="primary" 
 *   size="md"
 *   onClick={handleSubmit}
 *   aria-label="Submit booking form"
 * >
 *   Book Appointment
 * </Button>
 * ```
 * 
 * @param props - Button component properties
 * @returns React functional component with accessibility and performance optimizations
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className,
  style,
  'aria-label': ariaLabel,
  ...props
}) => {
  /**
   * Base CSS classes for consistent button styling
   * @description Provides foundation styles for all button variants including focus management,
   * transitions, and disabled states for optimal user experience
   */
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-semibold',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none',
  ];

  /**
   * Variant-specific styling classes
   * @description Maps button variants to their respective Tailwind CSS classes,
   * ensuring consistent design system implementation across the application
   */
  const variantClasses = {
    primary: [
      'bg-gray-900',
      'text-white',
      'hover:bg-gray-800',
      'focus:ring-gray-500',
      'active:bg-gray-700',
    ],
    secondary: [
      'bg-gray-100',
      'text-gray-900',
      'hover:bg-gray-200',
      'focus:ring-gray-300',
      'active:bg-gray-300',
    ],
    outline: [
      'border-2',
      'border-gray-900',
      'text-gray-900',
      'bg-transparent',
      'hover:bg-gray-900',
      'hover:text-white',
      'focus:ring-gray-500',
    ],
    ghost: [
      'text-gray-700',
      'bg-transparent',
      'hover:bg-gray-100',
      'focus:ring-gray-300',
      'active:bg-gray-200',
    ],
  };

  /**
   * Size-specific styling classes
   * @description Defines consistent sizing scale across all button variants,
   * maintaining visual hierarchy and touch target accessibility requirements
   */
  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm'],
    md: ['px-4', 'py-2', 'text-base'],
    lg: ['px-6', 'py-3', 'text-lg'],
  };

  /**
   * Combines all CSS classes using the utility function
   * @description Merges base, variant, size, and custom classes for final button styling
   */
  /**
   * Safely combine CSS classes with proper defaults
   * @description Ensures all class arrays exist before spreading to prevent runtime errors
   */
  const getClasses = () => {
    const safeVariantClasses = variantClasses[variant as keyof typeof variantClasses] || variantClasses.primary;
    const safeSizeClasses = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md;
    
    return cn(
      ...baseClasses,
      ...safeVariantClasses,
      ...safeSizeClasses,
      className
    );
  };

  const classes = getClasses();

  /**
   * Handles button click events with state validation
   * @description Prevents click handling when button is disabled or in loading state,
   * ensuring consistent user experience and preventing unintended actions
   */
  const handleClick = (): void => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={classes}
      style={style}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;