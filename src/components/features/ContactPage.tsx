/**
 * Contact Page Component
 *
 * Displays barbershop contact information and provides a contact form
 * that sends emails via EmailJS service.
 *
 * Features:
 * - Shop location, hours, phone, and email display
 * - Contact form with validation
 * - Dual email system: notification to owner and auto-reply to user
 * - Real-time form validation with error display
 * - Accessible form inputs with ARIA labels
 *
 * EmailJS Configuration:
 * - Service ID: service_5iviq2n
 * - Owner notification template: template_d1doroc
 * - User auto-reply template: template_17on3fq
 * - Public key: Zxi00MmA3WSCOlzwK
 */
import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { CONTACT_INFO } from '../../constants';
import { useFormValidation } from '../../hooks';
import { validateContactForm } from '../../utils';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Modal from '../ui/Modal';
import type { ContactFormData } from '../../types';

const initialContactData: ContactFormData = {
  name: '',
  email: '',
  phoneNumber: '',
  message: '',
};

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    variant: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    variant: 'info',
    title: '',
    message: ''
  });
  const {
    data: formData,
    errors,
    updateField,
    validate,
    reset,
  } = useFormValidation(initialContactData, validateContactForm);

  useEffect(() => {
    emailjs.init({
      publicKey: 'Zxi00MmA3WSCOlzwK',
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const templateParams = {
        name: formData.name,
        email: formData.email,
        title: formData.message,
        message: formData.message,
      };

      if (!templateParams.name || !templateParams.email || !templateParams.title) {
        throw new Error('Missing required fields: name, email, or message');
      }

      const ownerResponse = await emailjs.send(
        'service_5iviq2n',
        'template_d1doroc',
        templateParams
      );

      const userResponse = await emailjs.send(
        'service_5iviq2n',
        'template_17on3fq',
        templateParams
      );

      if (ownerResponse.status === 200 && userResponse.status === 200) {
        setModalState({
          isOpen: true,
          variant: 'success',
          title: 'Message Sent!',
          message: 'Your message has been sent successfully! We\'ll get back to you soon.'
        });
        reset();
      } else {
        throw new Error(`EmailJS returned status: Owner=${ownerResponse.status}, User=${userResponse.status}`);
      }
    } catch (error) {
      console.error('Failed to send email:', error);

      const userMessage = `We're sorry, but we couldn't send your message at this time. Please try again or give us a call at ${CONTACT_INFO.phone}. We're happy to help!`;

      if (error && typeof error === 'object') {
        const emailError = error as any;
        console.error('EmailJS error details:', {
          status: emailError.status,
          text: emailError.text
        });
      }

      setModalState({
        isOpen: true,
        variant: 'error',
        title: 'Unable to Send Message',
        message: userMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-12">
            GET IN TOUCH
          </h1>
          
          <div className="grid md:grid-cols-2 gap-12">
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
                        {errors.map((error) => (
                          <li key={error}>• {error}</li>
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

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        title={modalState.title}
        message={modalState.message}
        variant={modalState.variant}
      />
    </div>
  );
};

export default ContactPage;
