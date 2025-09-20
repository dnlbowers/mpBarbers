/**
 * Home Page Component - Landing page with hero section
 * Demonstrates the new modular architecture with TypeScript
 */

import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { SERVICES, TESTIMONIALS, APP_CONFIG } from '../../constants';
import { formatPrice, formatDuration } from '../../utils';
import { useSEO, useStructuredData, SEO_CONFIGS, BUSINESS_STRUCTURED_DATA } from '../../hooks/useSEO';
import Button from '../ui/Button';
import Card from '../ui/Card';
import BookingModal from '../ui/BookingModal';
import styles from './css/HomePage.module.css';
import heroImage from '../../assets/images/home/mpbarber-wide-view.webp';

const HomePage: React.FC = () => {
  const { setActiveTab } = useApp();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // SEO optimization
  useSEO(SEO_CONFIGS.home);
  useStructuredData(BUSINESS_STRUCTURED_DATA);

  // Memoize handlers to prevent unnecessary re-renders
  const handleMainCTAClick = React.useCallback(() => {
    setIsBookingModalOpen(true);
  }, []);

  const handleViewServicesClick = React.useCallback(() => {
    setActiveTab('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveTab]);

  return (
    <div>
      {/* Hero Section */}
      <section 
        className={`relative h-screen flex items-center justify-center ${styles.heroSection}`}
        style={{ '--hero-image': `url(${heroImage})` } as React.CSSProperties}
        aria-label="Hero section"
      >
        <div className={`text-center z-10 max-w-4xl mx-auto px-4 ${styles.heroContent}`}>
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">
            MP BARBERSHOP
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            {APP_CONFIG.tagline}
          </p>
          <Button
            size="lg"
            onClick={handleMainCTAClick}
            aria-label="Book your appointment"
          >
            BOOK YOUR CUT
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section 
        className="py-20 bg-white"
        aria-label="Our services"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            OUR SERVICES
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {SERVICES.slice(0, 3).map((service) => (
              <button
                key={service.id}
                className={`bg-white border border-gray-200 rounded-lg p-6 text-center transition-all duration-200 hover:border-gray-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 ${styles.serviceCard}`}
                onClick={handleViewServicesClick}
                aria-label={`View ${service.name} details and pricing`}
              >
                <h3 className="text-2xl font-semibold mb-2">
                  {service.name}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {formatPrice(service.price)}
                </p>
                <p className="text-gray-600">
                  {formatDuration(service.duration)}
                </p>
                {service.description && (
                  <p className="text-sm text-gray-500 mt-2">
                    {service.description}
                  </p>
                )}
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              variant="ghost"
              onClick={handleViewServicesClick}
              aria-label="View all services and pricing"
            >
              View All Services →
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        className="py-20 bg-gray-50"
        aria-label="Customer testimonials"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">
            WHAT OUR CLIENTS SAY
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <Card
                key={testimonial.id}
                variant="elevated"
                className="text-left"
              >
                <div className="flex justify-center mb-4" aria-label={`${testimonial.rating} star rating`}>
                  <span className="text-2xl" aria-hidden="true">
                    {'★'.repeat(testimonial.rating)}
                  </span>
                </div>
                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.comment}"
                </blockquote>
                <cite className="font-semibold not-italic">
                  - {testimonial.customerName}
                </cite>
                {testimonial.verified && (
                  <span className="ml-2 text-green-600 text-sm" aria-label="Verified review">
                    ✓ Verified
                  </span>
                )}
              </Card>
            ))}
          </div>

          {/* Review Links */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">Love our service? Share your experience!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => window.open('https://search.google.com/local/writereview?placeid=ChIJ90EizyFRDhMR8law8bqvA7U', '_blank', 'noopener,noreferrer')}
                className="flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Leave a Google Review
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('https://www.facebook.com/profile.php?id=61577771502632&sk=reviews', '_blank', 'noopener,noreferrer')}
                className="flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Leave a Facebook Review
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        className="py-20 bg-white"
        aria-label="Company statistics"
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2" aria-label="500 plus happy clients">
                500+
              </div>
              <p className="text-gray-600">Happy Clients</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2" aria-label="4 expert barbers">
                4
              </div>
              <p className="text-gray-600">Expert Barbers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2" aria-label="5 star average rating">
                5★
              </div>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default React.memo(HomePage);
