/**
 * Modal Component
 *
 * A reusable modal dialog component for displaying notifications,
 * confirmations, or any content in an overlay.
 *
 * Features:
 * - Accessible with proper ARIA attributes
 * - Keyboard navigation (ESC to close)
 * - Click outside to close
 * - Success and error variants
 * - Smooth fade-in animation
 * - Focus management
 */
import React, { useEffect, useRef } from 'react';
import BaseModal from './BaseModal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  variant?: 'success' | 'error' | 'info';
  confirmText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  variant = 'info',
  confirmText = 'OK'
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      confirmButtonRef.current?.focus();
    }
  }, [isOpen]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          icon: '✓',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          buttonClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        };
      case 'error':
        return {
          icon: '✕',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          buttonClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      default:
        return {
          icon: 'ℹ',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          buttonClass: 'bg-gray-900 hover:bg-gray-800 focus:ring-gray-500'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      showCloseButton={false}
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
    >
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
            <span className={`text-xl font-bold ${styles.iconColor}`} aria-hidden="true">
              {styles.icon}
            </span>
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            {title && (
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                {title}
              </h3>
            )}
            <div className="mt-2">
              <p
                className="text-sm text-gray-500"
                id="modal-message"
              >
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          ref={confirmButtonRef}
          type="button"
          className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${styles.buttonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors`}
          onClick={onClose}
        >
          {confirmText}
        </button>
      </div>
    </BaseModal>
  );
};

export default Modal;