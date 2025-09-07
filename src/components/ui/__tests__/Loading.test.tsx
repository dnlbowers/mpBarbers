/**
 * Loading Components Tests
 * Improving coverage from 50% to target 85%+
 * Testing all loading component variants and their functionality
 */

import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Loading Components', () => {
  let Skeleton: React.ComponentType<any>;
  let ServiceCardSkeleton: React.ComponentType;
  let TestimonialSkeleton: React.ComponentType;
  let TimeSlotsSkeleton: React.ComponentType;
  let LoadingSpinner: React.ComponentType<any>;
  let LoadingOverlay: React.ComponentType<any>;
  
  beforeEach(() => {
    const loadingModule = require('../Loading');
    Skeleton = loadingModule.default;
    ServiceCardSkeleton = loadingModule.ServiceCardSkeleton;
    TestimonialSkeleton = loadingModule.TestimonialSkeleton;
    TimeSlotsSkeleton = loadingModule.TimeSlotsSkeleton;
    LoadingSpinner = loadingModule.LoadingSpinner;
    LoadingOverlay = loadingModule.LoadingOverlay;
  });

  describe('Skeleton Component', () => {
    test('renders with default props', () => {
      render(<Skeleton />);
      
      const skeleton = document.querySelector('.bg-gray-200');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse');
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    });

    test('renders with custom className', () => {
      render(<Skeleton className="custom-class" />);
      
      const skeleton = document.querySelector('.custom-class');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('bg-gray-200', 'rounded', 'animate-pulse');
    });

    test('renders without animation when animate is false', () => {
      render(<Skeleton animate={false} />);
      
      const skeleton = document.querySelector('.bg-gray-200');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).not.toHaveClass('animate-pulse');
    });

    test('renders with animation when animate is true', () => {
      render(<Skeleton animate={true} />);
      
      const skeleton = document.querySelector('.bg-gray-200');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse');
    });
  });

  describe('ServiceCardSkeleton Component', () => {
    test('renders service card skeleton structure', () => {
      render(<ServiceCardSkeleton />);
      
      const container = document.querySelector('.border.border-gray-200.p-6.rounded-md');
      expect(container).toBeInTheDocument();
      
      const skeletons = container?.querySelectorAll('[aria-hidden="true"]');
      expect(skeletons).toHaveLength(3);
    });

    test('has correct skeleton sizes for service card', () => {
      render(<ServiceCardSkeleton />);
      
      const container = document.querySelector('.border.border-gray-200.p-6.rounded-md');
      const skeletons = container?.querySelectorAll('[aria-hidden="true"]');
      
      expect(skeletons?.[0]).toHaveClass('h-6', 'w-3/4', 'mb-3');
      expect(skeletons?.[1]).toHaveClass('h-8', 'w-1/2', 'mb-2');
      expect(skeletons?.[2]).toHaveClass('h-4', 'w-1/3');
    });
  });

  describe('TestimonialSkeleton Component', () => {
    test('renders testimonial skeleton structure', () => {
      render(<TestimonialSkeleton />);
      
      const container = document.querySelector('.bg-white.p-6.shadow-sm.rounded-md');
      expect(container).toBeInTheDocument();
      
      const skeletons = container?.querySelectorAll('[aria-hidden="true"]');
      expect(skeletons).toHaveLength(4);
    });

    test('has correct structure for testimonial', () => {
      render(<TestimonialSkeleton />);
      
      const container = document.querySelector('.bg-white.p-6.shadow-sm.rounded-md');
      const centerDiv = container?.querySelector('.flex.justify-center.mb-4');
      expect(centerDiv).toBeInTheDocument();
      
      const skeletons = container?.querySelectorAll('[aria-hidden="true"]');
      expect(skeletons?.[0]).toHaveClass('h-6', 'w-24');
      expect(skeletons?.[1]).toHaveClass('h-4', 'w-full', 'mb-2');
      expect(skeletons?.[2]).toHaveClass('h-4', 'w-5/6', 'mb-4');
      expect(skeletons?.[3]).toHaveClass('h-4', 'w-1/3');
    });
  });

  describe('TimeSlotsSkeleton Component', () => {
    test('renders time slots skeleton grid', () => {
      render(<TimeSlotsSkeleton />);
      
      const grid = document.querySelector('.grid.grid-cols-4.md\\:grid-cols-8.gap-2');
      expect(grid).toBeInTheDocument();
      
      const skeletons = grid?.querySelectorAll('[aria-hidden="true"]');
      expect(skeletons).toHaveLength(16);
    });

    test('each time slot skeleton has correct classes', () => {
      render(<TimeSlotsSkeleton />);
      
      const grid = document.querySelector('.grid.grid-cols-4.md\\:grid-cols-8.gap-2');
      const skeletons = grid?.querySelectorAll('[aria-hidden="true"]');
      
      skeletons?.forEach(skeleton => {
        expect(skeleton).toHaveClass('h-10', 'w-full');
      });
    });
  });

  describe('LoadingSpinner Component', () => {
    test('renders with default size (md)', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByLabelText('Loading');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('h-8', 'w-8', 'animate-spin', 'text-gray-600');
    });

    test('renders with small size', () => {
      render(<LoadingSpinner size="sm" />);
      
      const spinner = screen.getByLabelText('Loading');
      expect(spinner).toHaveClass('h-4', 'w-4');
    });

    test('renders with large size', () => {
      render(<LoadingSpinner size="lg" />);
      
      const spinner = screen.getByLabelText('Loading');
      expect(spinner).toHaveClass('h-12', 'w-12');
    });

    test('applies custom className', () => {
      render(<LoadingSpinner className="custom-spinner" />);
      
      const container = document.querySelector('.custom-spinner');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('flex', 'justify-center', 'items-center');
    });

    test('has proper SVG structure', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByLabelText('Loading');
      expect(spinner).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
      expect(spinner).toHaveAttribute('fill', 'none');
      expect(spinner).toHaveAttribute('viewBox', '0 0 24 24');
      
      const circle = spinner.querySelector('circle');
      const path = spinner.querySelector('path');
      
      expect(circle).toBeInTheDocument();
      expect(circle).toHaveClass('opacity-25');
      expect(path).toBeInTheDocument();
      expect(path).toHaveClass('opacity-75');
    });
  });

  describe('LoadingOverlay Component', () => {
    test('renders children when not loading', () => {
      render(
        <LoadingOverlay isLoading={false}>
          <div>Content</div>
        </LoadingOverlay>
      );
      
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument();
    });

    test('renders overlay when loading', () => {
      render(
        <LoadingOverlay isLoading={true}>
          <div>Content</div>
        </LoadingOverlay>
      );
      
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    test('renders custom loading message', () => {
      render(
        <LoadingOverlay isLoading={true} message="Please wait...">
          <div>Content</div>
        </LoadingOverlay>
      );
      
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    test('overlay has proper styling and structure', () => {
      render(
        <LoadingOverlay isLoading={true}>
          <div>Content</div>
        </LoadingOverlay>
      );
      
      const overlay = document.querySelector('.absolute.inset-0.bg-white.bg-opacity-75');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass('flex', 'items-center', 'justify-center', 'z-10');
      
      const textCenter = overlay?.querySelector('.text-center');
      expect(textCenter).toBeInTheDocument();
    });

    test('uses default message when none provided', () => {
      render(
        <LoadingOverlay isLoading={true}>
          <div>Content</div>
        </LoadingOverlay>
      );
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders with large spinner in overlay', () => {
      render(
        <LoadingOverlay isLoading={true}>
          <div>Content</div>
        </LoadingOverlay>
      );
      
      const spinner = screen.getByLabelText('Loading');
      expect(spinner).toHaveClass('h-12', 'w-12');
    });

    test('maintains relative positioning for container', () => {
      render(
        <LoadingOverlay isLoading={false}>
          <div>Content</div>
        </LoadingOverlay>
      );
      
      const container = screen.getByText('Content').parentElement;
      expect(container).toHaveClass('relative');
    });
  });

  describe('Component Integration', () => {
    test('all components can be rendered together', () => {
      render(
        <div>
          <Skeleton />
          <ServiceCardSkeleton />
          <TestimonialSkeleton />
          <TimeSlotsSkeleton />
          <LoadingSpinner />
          <LoadingOverlay isLoading={false}>
            <div>Content</div>
          </LoadingOverlay>
        </div>
      );
      
      // Should render without errors
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });
});
