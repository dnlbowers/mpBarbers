/**
 * Contact Page Component - Contact information and form
 */

import React, { useState } from 'react';
import { CONTACT_INFO } from '../../constants';
import { useFormValidation } from '../../hooks';
import { validateContactForm } from '../../utils';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import type { ContactFormData } from '../../types';

const initialContactData: ContactFormData = {
  name: '',
  email: '',
  phoneNumber: '',
  message: '',
};

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    data: formData,
    errors,
    updateField,
    validate,
    reset,
  } = useFormValidation(initialContactData, validateContactForm);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Message sent successfully! We\'ll get back to you soon.');
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="pt-20">
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-12">
            GET IN TOUCH
          </h1>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-semibold mb-8">Visit Us</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <span className="text-2xl mr-4" aria-hidden="true">📍</span>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <address className="text-gray-600 not-italic">
                      {CONTACT_INFO.address.street}<br />
                      {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state}<br />
                      {CONTACT_INFO.address.zipCode}
                    </address>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-4" aria-hidden="true">🕐</span>
                  <div>
                    <h3 className="font-semibold mb-1">Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday: Closed</p>
                      <p>Tuesday: 8:30 AM - 1:00 PM, 2:00 PM - 7:00 PM</p>
                      <p>Wednesday: 8:30 AM - 1:00 PM, 2:00 PM - 7:00 PM</p>
                      <p>Thursday: 8:30 AM - 1:00 PM, 2:00 PM - 7:00 PM</p>
                      <p>Friday: 8:30 AM - 1:00 PM, 2:00 PM - 7:00 PM</p>
                      <p>Saturday: 8:30 AM - 1:00 PM, 2:00 PM - 7:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-4" aria-hidden="true">📞</span>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a 
                      href={`tel:${CONTACT_INFO.phone}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-4" aria-hidden="true">✉️</span>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a 
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card padding="lg">
              <h2 className="text-3xl font-semibold mb-8">Send a Message</h2>
              
              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                  <Input
                    type="text"
                    id="contact-name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(value) => updateField('name', value)}
                    required
                    aria-label="Enter your name"
                  />
                  
                  <Input
                    type="email"
                    id="contact-email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(value) => updateField('email', value)}
                    required
                    aria-label="Enter your email address"
                  />
                  
                  <Input
                    type="tel"
                    id="contact-phone"
                    placeholder="Phone Number (Optional)"
                    value={formData.phoneNumber}
                    onChange={(value) => updateField('phoneNumber', value)}
                    aria-label="Enter your phone number"
                  />
                  
                  <textarea
                    id="contact-message"
                    placeholder="Your Message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                    aria-label="Enter your message"
                  />
                  
                  {errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4" role="alert">
                      <ul className="text-red-700 text-sm space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    size="lg"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
