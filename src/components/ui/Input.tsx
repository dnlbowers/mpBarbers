import React, { forwardRef } from 'react';
import type { InputProps } from '../../types';
import { cn } from '../../utils';

/**
 * Accessible Form Input Component
 * 
 * @description Provides a comprehensive form input component with built-in validation,
 * error handling, and accessibility features. Supports multiple input types with
 * consistent styling and comprehensive screen reader support including ARIA attributes.
 * 
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   placeholder="Enter your email"
 *   value={email}
 *   onChange={setEmail}
 *   required
 *   error={emailError}
 *   aria-label="Email address"
 * />
 * ```
 * 
 * @param props - Input component properties
 * @param ref - Forward ref for direct DOM access
 * @returns React functional component with accessibility and validation features
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  className,
  'aria-label': ariaLabel,
  id,
  min,
  max,
  ...props
}, ref) => {
  /**
   * Base CSS classes for consistent input styling
   * @description Provides foundation styles including layout, typography, transitions,
   * focus management, and disabled states for optimal user experience across all input types
   */
  const baseClasses = [
    'w-full',
    'px-3',
    'py-2',
    'border',
    'rounded-md',
    'text-gray-900',
    'placeholder-gray-500',
    'transition-colors',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:bg-gray-50',
  ];

  /**
   * Validation state styling classes
   * @description Applies different border and focus colors based on validation state,
   * providing immediate visual feedback for form validation errors
   */
  const validationClasses = error
    ? [
        'border-red-300',
        'focus:border-red-500',
        'focus:ring-red-500',
      ]
    : [
        'border-gray-300',
        'focus:border-gray-500',
        'focus:ring-gray-500',
      ];

  /**
   * Combines all CSS classes for final input styling
   * @description Merges base, validation, and custom classes using utility function
   * for consistent class name handling and optimal performance
   */
  const classes = cn(
    ...baseClasses,
    ...validationClasses,
    className
  );

  /**
   * Handles input value changes with optional callback
   * @description Processes input changes and calls the provided onChange callback
   * with the new value, enabling controlled component patterns
   * 
   * @param event - React change event from input element
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={ref}
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className={classes}
        aria-label={ariaLabel}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        min={min}
        max={max}
        {...props}
      />
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;