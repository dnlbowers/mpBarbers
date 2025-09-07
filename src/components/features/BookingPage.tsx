/**
 * Booking Page Component - Advanced booking form with validation
 * Demonstrates custom hooks, form management, and accessibility
 */

import React from 'react';
import { useBookingForm, useTimeSlots } from '../../hooks';
import { SERVICES } from '../../constants';
import { formatPrice, formatDuration, getMinBookingDate, getMaxBookingDate } from '../../utils';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const BookingPage: React.FC = () => {
  const { 
    formData, 
    formErrors, 
    isSubmitting, 
    updateField, 
    submitForm 
  } = useBookingForm();

  const { timeSlots, loading: timeSlotsLoading } = useTimeSlots(formData.date);

  const handleServiceSelect = (serviceId: string) => {
    updateField('service', serviceId);
  };

  const handleTimeSelect = (time: string) => {
    updateField('time', time);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const success = await submitForm();
    if (success) {
      // Show success message or redirect
      alert('Booking confirmed! We\'ll contact you shortly.');
    }
  };

  return (
    <div className="pt-20 pb-20">
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-12">
            BOOK YOUR APPOINTMENT
          </h1>
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-12">
              
              {/* Step 1: Service Selection */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  1. Select Service
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {SERVICES.map((service) => (
                    <Card
                      key={service.id}
                      variant="outlined"
                      padding="md"
                      hover
                      className={`cursor-pointer transition-all ${
                        formData.service === service.id
                          ? 'border-gray-900 bg-gray-50 ring-2 ring-gray-900'
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => handleServiceSelect(service.id)}
                      role="button"
                      tabIndex={0}
                      aria-pressed={formData.service === service.id}
                      aria-label={`Select ${service.name} - ${formatPrice(service.price)} for ${formatDuration(service.duration)}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleServiceSelect(service.id);
                        }
                      }}
                    >
                      <div className="font-semibold text-lg mb-1">
                        {service.name}
                      </div>
                      <div className="text-gray-600 mb-2">
                        {formatPrice(service.price)} • {formatDuration(service.duration)}
                      </div>
                      {service.description && (
                        <div className="text-sm text-gray-500">
                          {service.description}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>

              {/* Step 2: Date Selection */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  2. Select Date
                </h2>
                <Input
                  type="date"
                  id="booking-date"
                  value={formData.date}
                  onChange={(value) => updateField('date', value)}
                  min={getMinBookingDate()}
                  max={getMaxBookingDate()}
                  required
                  aria-label="Select appointment date"
                  className="max-w-xs"
                />
              </div>

              {/* Step 3: Time Selection */}
              {formData.date && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">
                    3. Select Time
                  </h2>
                  {timeSlotsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      <span className="ml-2 text-gray-600">Loading available times...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={formData.time === slot.time ? 'primary' : 'outline'}
                          size="sm"
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot.time)}
                          aria-label={`${slot.time} ${slot.available ? 'available' : 'unavailable'}`}
                          className="text-sm"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Customer Details */}
              <div>
                <h2 className="text-2xl font-semibold mb-6">
                  4. Your Details
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    type="text"
                    id="full-name"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(value) => updateField('fullName', value)}
                    required
                    aria-label="Enter your full name"
                  />
                  <Input
                    type="tel"
                    id="phone"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(value) => updateField('phoneNumber', value)}
                    required
                    aria-label="Enter your phone number"
                  />
                  <div className="md:col-span-2">
                    <Input
                      type="email"
                      id="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(value) => updateField('email', value)}
                      required
                      aria-label="Enter your email address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <textarea
                      id="special-requests"
                      placeholder="Special Requests (Optional)"
                      rows={3}
                      value={formData.specialRequests}
                      onChange={(e) => updateField('specialRequests', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                      aria-label="Enter any special requests"
                    />
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {formErrors.length > 0 && (
                <div 
                  className="bg-red-50 border border-red-200 rounded-md p-4"
                  role="alert"
                  aria-live="polite"
                >
                  <h3 className="text-red-800 font-semibold mb-2">
                    Please correct the following errors:
                  </h3>
                  <ul className="text-red-700 text-sm space-y-1">
                    {formErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="w-full"
                aria-label="Confirm your booking"
              >
                {isSubmitting ? 'CONFIRMING BOOKING...' : 'CONFIRM BOOKING'}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;
