/**
 * Home Page Component - Landing page with hero section
 * Demonstrates the new modular architecture with TypeScript
 */

import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { SERVICES, TESTIMONIALS, APP_CONFIG } from '../../constants';
import { formatPrice, formatDuration } from '../../utils';
import { useSEO, useStructuredData, SEO_CONFIGS, BUSINESS_STRUCTURED_DATA } from '../../hooks/useSEO';
import { usePerformanceMonitor, useAnalytics } from '../../hooks/usePerformance';
import Button from '../ui/Button';
import Card from '../ui/Card';
import styles from './css/HomePage.module.css';
import heroImage from '../../assets/images/home/mpbarber-wide-view.webp';

const HomePage: React.FC = () => {
  const { setActiveTab } = useApp();
  
  // SEO optimization
  useSEO(SEO_CONFIGS.home);
  useStructuredData(BUSINESS_STRUCTURED_DATA);
  
  // Performance monitoring
  const { startRender, endRender } = usePerformanceMonitor('HomePage');
  const { trackPageView, trackButtonClick } = useAnalytics();

  React.useEffect(() => {
    startRender();
    trackPageView('home');
    return endRender;
  }, [startRender, endRender, trackPageView]);

  const handleBookingClick = () => {
    trackButtonClick('book_appointment', 'hero_section');
    setActiveTab('booking');
  };

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
            MODERN CUTS
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            {APP_CONFIG.tagline}
          </p>
          <Button 
            size="lg"
            onClick={handleBookingClick}
            aria-label="Book your appointment now"
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
              <Card
                key={service.id}
                variant="outlined"
                hover
                className={`text-center cursor-pointer ${styles.serviceCard}`}
                onClick={handleBookingClick}
                role="button"
                tabIndex={0}
                aria-label={`Book ${service.name} - ${formatPrice(service.price)}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleBookingClick();
                  }
                }}
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
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              variant="ghost"
              onClick={handleBookingClick}
              aria-label="View all services and book appointment"
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
    </div>
  );
};

export default HomePage;
