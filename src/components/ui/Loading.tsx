import React from 'react';
import { cn } from '../../utils';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

/**
 * Base Skeleton Component
 * 
 * @description Creates animated skeleton placeholders for content loading states.
 * Provides visual feedback during async operations, improving perceived performance
 * and user experience by showing content structure before data loads.
 * 
 * @param className - Additional CSS classes for customization
 * @param animate - Whether to show pulsing animation
 * @returns Skeleton placeholder element with accessibility attributes
 */
const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  animate = true 
}) => {
  return (
    <div
      className={cn(
        'bg-gray-200 rounded',
        animate && 'animate-pulse',
        className
      )}
      aria-hidden="true"
    />
  );
};

/**
 * Service Card Skeleton Component
 * 
 * @description Displays skeleton layout matching the service card structure.
 * Used during service data loading to maintain visual consistency and
 * prevent layout shifts that degrade user experience.
 * 
 * @returns Service card skeleton with realistic proportions
 */
export const ServiceCardSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-200 p-6 rounded-md">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-8 w-1/2 mb-2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
};

/**
 * Testimonial Skeleton Component
 * 
 * @description Creates skeleton layout for testimonial components during loading.
 * Maintains visual hierarchy and spacing to prevent cumulative layout shift
 * when actual testimonial data is rendered.
 * 
 * @returns Testimonial skeleton with appropriate spacing and structure
 */
export const TestimonialSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 shadow-sm rounded-md">
      <div className="flex justify-center mb-4">
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
};

/**
 * Time Slots Skeleton Component
 * 
 * @description Renders skeleton placeholders for appointment time slot grid.
 * Provides immediate visual feedback while time availability data loads
 * from the booking service API.
 * 
 * @returns Grid of time slot skeleton elements
 */
export const TimeSlotsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
      {Array.from({ length: 16 }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Loading Spinner Component
 * 
 * @description Animated spinner for loading states with multiple size options.
 * Provides visual feedback during short-duration async operations where
 * skeleton screens would be unnecessary or inappropriate.
 * 
 * @param size - Spinner size variant (sm, md, lg)
 * @param className - Additional CSS classes for customization
 * @returns Accessible animated loading spinner
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  /**
   * Size class mapping for consistent spinner scaling
   * @description Maps size variants to Tailwind CSS classes for consistent
   * visual hierarchy across different loading contexts
   */
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex justify-center items-center', className)}>
      <svg
        className={cn(
          'animate-spin text-gray-600',
          sizeClasses[size]
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
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
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
}

/**
 * Loading Overlay Component
 * 
 * @description Provides a semi-transparent overlay with loading spinner for
 * async operations that need to prevent user interaction while maintaining
 * context of the underlying content.
 * 
 * @param isLoading - Whether to show the loading overlay
 * @param children - Content to be overlaid during loading
 * @param message - Optional loading message to display
 * @returns Content with conditional loading overlay
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  message = 'Loading...'
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-2 text-gray-600">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skeleton;