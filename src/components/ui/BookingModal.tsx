/**
 * BookingModal Component
 *
 * A modal dialog that provides a seamless booking experience.
 * Shows booking information and opens Fresha in a new tab.
 *
 * Features:
 * - Service selection preview
 * - Business hours display
 * - Direct booking link to Fresha
 * - Keyboard navigation (ESC to close)
 * - Click outside to close
 * - Accessible with proper ARIA attributes
 */
import React from 'react';
import BaseModal from './BaseModal';
import Button from './Button';
import { CONTACT_INFO, SERVICES } from '../../constants';
import { formatPrice } from '../../utils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingUrl?: string;
}

const DEFAULT_BOOKING_URL = 'https://www.fresha.com/a/mp-barbershop-birkirkara-triq-il-karmnu-birkirkara-atsvpl0i/booking?cartId=3584a3ab-5887-4986-a1f9-f6a960c7b8a5';

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  bookingUrl = DEFAULT_BOOKING_URL
}) => {
  const handleBookingClick = () => {
    window.open(bookingUrl, '_blank');
    onClose();
  };

  const topServices = SERVICES.slice(0, 6);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      backdropOpacity={50}
      aria-labelledby="booking-modal-title"
    >
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 id="booking-modal-title" className="text-2xl font-bold text-gray-900">
            Book Your Appointment
          </h2>
          <p className="text-sm text-gray-600 mt-1">Choose your service and book online</p>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Popular Services</h3>
          <div className="grid grid-cols-2 gap-3">
            {topServices.map(service => (
              <div key={service.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{service.name}</p>
                  <p className="text-xs text-gray-600">{service.duration} mins</p>
                </div>
                <p className="font-semibold text-sm">{formatPrice(service.price)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-md font-semibold mb-2 text-blue-900">Opening Hours</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>Tuesday - Saturday: 8:30 AM - 1:00 PM, 2:00 PM - 7:00 PM</p>
            <p>Sunday & Monday: Closed</p>
          </div>
        </div>

        <div className="mb-6 text-center">
          <p className="text-gray-600 mb-2">📍 {CONTACT_INFO.address.street}, {CONTACT_INFO.address.city}</p>
          <p className="text-gray-600">📞 {CONTACT_INFO.phone}</p>
        </div>

        <Button
          size="lg"
          onClick={handleBookingClick}
          className="w-full"
          aria-label="Complete booking on Fresha (opens in new tab)"
        >
          Complete Booking on Fresha →
        </Button>

        <p className="text-xs text-gray-500 text-center mt-4">
          You'll be redirected to our secure booking partner in a new tab while keeping this page open in the background
        </p>
      </div>
    </BaseModal>
  );
};

export default BookingModal;