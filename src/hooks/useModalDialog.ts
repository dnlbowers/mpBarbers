/**
 * useModalDialog Hook
 *
 * Custom hook that manages HTML5 dialog element state and behavior.
 * Provides consistent modal functionality across different modal components.
 *
 * Features:
 * - Automatic dialog open/close with proper methods
 * - Click outside to close functionality
 * - ESC key handling via native dialog cancel event
 * - Body scroll lock when modal is open
 * - Cleanup on unmount
 */
import { useEffect, useRef } from 'react';

interface UseModalDialogOptions {
  isOpen: boolean;
  onClose: () => void;
  autoFocus?: boolean;
}

export const useModalDialog = ({
  isOpen,
  onClose}: UseModalDialogOptions) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Modal state management
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.close();
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    const handleClick = (e: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        onClose();
      }
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleClick);

    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleClick);
    };
  }, [onClose]);

  return { dialogRef };
};