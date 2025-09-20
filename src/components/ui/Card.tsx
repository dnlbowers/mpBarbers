import React from 'react';
import type { BaseComponentProps } from '../../types';
import { cn } from '../../utils';

interface CardProps extends BaseComponentProps {
  readonly variant?: 'default' | 'outlined' | 'elevated';
  readonly padding?: 'none' | 'sm' | 'md' | 'lg';
  readonly hover?: boolean;
  readonly onClick?: () => void;
  readonly type?: 'button' | 'submit' | 'reset';
  readonly 'aria-label'?: string;
  readonly 'aria-pressed'?: boolean;
  readonly disabled?: boolean;
}

/**
 * Flexible Card Container Component
 *
 * @description Provides a consistent, reusable container component for organizing content
 * with multiple variants, padding options, and interactive states. Automatically renders
 * as a semantic button element when interactive to ensure proper accessibility for screen
 * readers and keyboard navigation. Non-interactive cards render as div elements.
 *
 * @example
 * ```tsx
 * <Card
 *   variant="elevated"
 *   padding="lg"
 *   hover
 *   onClick={handleCardClick}
 *   aria-label="Service booking card"
 * >
 *   Service information
 * </Card>
 * ```
 *
 * @param children - Content to display within the card
 * @param variant - Visual style variant affecting elevation and borders
 * @param padding - Internal spacing size following design system scale
 * @param hover - Whether to show interactive hover effects for clickable cards
 * @param onClick - Click handler function; when provided, renders as accessible button
 * @param type - Button type when interactive (button, submit, reset)
 * @param disabled - Whether interactive card should be disabled
 * @param className - Additional CSS classes for custom styling
 * @returns Semantic HTML element (button if interactive, div if static) with consistent styling
 */
const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
  type = 'button',
  disabled = false,
  className,
  ...props
}) => {
  const baseClasses = [
    'bg-white',
    'transition-all',
    'duration-200',
  ];

  const variantClasses = {
    default: [],
    outlined: ['border', 'border-gray-200'],
    elevated: ['shadow-sm', 'hover:shadow-md'],
  };

  const paddingClasses = {
    none: [],
    sm: ['p-4'],
    md: ['p-6'],
    lg: ['p-8'],
  };

  const hoverClasses = hover
    ? ['hover:border-gray-400', 'cursor-pointer']
    : [];

  const classes = cn(
    ...baseClasses,
    ...variantClasses[variant],
    ...paddingClasses[padding],
    ...hoverClasses,
    className
  );

  if (onClick) {
    return (
      <button
        type={type}
        className={classes}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;