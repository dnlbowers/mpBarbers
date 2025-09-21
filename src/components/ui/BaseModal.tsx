/**
 * BaseModal Component
 *
 * A foundational modal component that provides common dialog functionality.
 * Serves as the base for all specialized modal components in the application.
 *
 * Features:
 * - Consistent HTML5 dialog structure
 * - Configurable sizes and backdrop opacity
 * - Optional close button
 * - Proper accessibility attributes
 * - Shared styling patterns
 */
import React from 'react';
import { useModalDialog } from '../../hooks/useModalDialog';
import type { BaseComponentProps } from '../../types';

interface BaseModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  backdropOpacity?: 25 | 50 | 75;
  showCloseButton?: boolean;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  size = 'lg',
  backdropOpacity = 75,
  showCloseButton = true,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const { dialogRef } = useModalDialog({ isOpen, onClose });

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  const backdropClasses = {
    25: 'backdrop:bg-black backdrop:bg-opacity-25',
    50: 'backdrop:bg-black backdrop:bg-opacity-50',
    75: 'backdrop:bg-black backdrop:bg-opacity-75'
  };

  const backdropClass = backdropClasses[backdropOpacity];

  return (
    <dialog
      ref={dialogRef}
      className={`p-0 rounded-lg shadow-xl ${backdropClass} ${sizeClasses[size]} w-[90vw] ${className}`}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      <div className="bg-white rounded-lg overflow-hidden relative">
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 z-10"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {children}
      </div>
    </dialog>
  );
};

export default BaseModal;