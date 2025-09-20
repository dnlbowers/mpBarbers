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
 * with multiple variants, padding options, and interactive states. Implements semantic HTML
 * structure with accessibility considerations for screen readers and keyboard navigation.
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
 *   <Card.Content>
 *     Service information
 *   </Card.Content>
 * </Card>
 * ```
 * 
 * @param props - Card component properties
 * @returns React functional component with flexible content container
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
  /**
   * Base CSS classes for consistent card styling
   * @description Provides foundation styles including background, transitions,
   * and core layout properties shared across all card variants
   */
  const baseClasses = [
    'bg-white',
    'transition-all',
    'duration-200',
  ];

  /**
   * Variant-specific styling classes
   * @description Maps card variants to their respective visual treatments,
   * supporting different elevation levels and border treatments for design flexibility
   */
  const variantClasses = {
    default: [],
    outlined: ['border', 'border-gray-200'],
    elevated: ['shadow-sm', 'hover:shadow-md'],
  };

  /**
   * Padding size classes
   * @description Defines consistent internal spacing options following the design system
   * spacing scale for proper content hierarchy and visual rhythm
   */
  const paddingClasses = {
    none: [],
    sm: ['p-4'],
    md: ['p-6'],
    lg: ['p-8'],
  };

  /**
   * Interactive hover state classes
   * @description Applies hover effects when card is interactive, providing visual feedback
   * for clickable cards and improving user experience with clear interaction states
   */
  const hoverClasses = hover
    ? ['hover:border-gray-400', 'cursor-pointer']
    : [];

  /**
   * Combines all CSS classes for final card styling
   * @description Merges base, variant, padding, hover, and custom classes
   * using the utility function for consistent class name handling
   */
  const classes = cn(
    ...baseClasses,
    ...variantClasses[variant],
    ...paddingClasses[padding],
    ...hoverClasses,
    className
  );

  // If interactive, render as button for proper accessibility
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

  // If not interactive, render as div
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