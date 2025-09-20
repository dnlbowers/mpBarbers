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
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      confirmButtonRef.current?.focus();

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
    return undefined;
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          aria-hidden="true"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div
          ref={modalRef}
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
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
        </div>
      </div>
    </div>
  );
};

export default Modal;