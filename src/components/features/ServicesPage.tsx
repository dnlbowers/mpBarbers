/**
 * Services Page Component - Complete service listing with pricing
 * Displays all available services organized by category with external booking
 */

import React from 'react';
import { SERVICES, SERVICE_CATEGORIES } from '../../constants';
import { formatPrice, formatDuration } from '../../utils';
import { useSEO } from '../../hooks/useSEO';
import Button from '../ui/Button';

const ServicesPage: React.FC = () => {
  const [showStickyButton, setShowStickyButton] = React.useState(false);

  // SEO optimization
  useSEO({
    title: 'Services & Pricing - MP Barbershop',
    description: 'Professional barbershop services including haircuts, beard grooming, and styling. View our complete service menu with pricing.',
    keywords: ['barbershop services', 'haircuts', 'beard grooming', 'pricing', 'Malta barber'],
  });

  // Sticky button scroll logic with throttling
  React.useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          
          // Show sticky button after scrolling past first screen
          const hasScrolledEnough = scrollPosition > windowHeight * 0.3;
          
          // Hide sticky button when near bottom (last 20% of page)
          const nearBottom = scrollPosition + windowHeight > documentHeight * 0.8;
          
          setShowStickyButton(hasScrolledEnough && !nearBottom);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookingClick = React.useCallback(() => {
    window.open('https://www.fresha.com/a/mp-barbershop-birkirkara-triq-il-karmnu-birkirkara-atsvpl0i/booking?cartId=3584a3ab-5887-4986-a1f9-f6a960c7b8a5', '_blank');
  }, []);

  // Group services by category (memoized for performance)
  const servicesByCategory = React.useMemo(() => {
    const grouped: Record<string, Array<typeof SERVICES[number]>> = {};
    
    SERVICES.forEach(service => {
      if (!grouped[service.category]) {
        grouped[service.category] = [];
      }
      grouped[service.category].push(service);
    });
    
    return grouped;
  }, []); // Empty dependency array since SERVICES is constant

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-wide">
            SERVICE MENU
          </h1>
          <div className="w-24 h-0.5 bg-gray-900 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-8">
            Professional barbershop services with experienced barbers.<br/>
            Traditional craftsmanship meets modern precision.
          </p>
          
          {/* Top Booking CTA */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-lg mx-auto">
            <p className="text-sm text-gray-600 mb-4">
              Ready to book? Schedule your appointment while browsing our services.
            </p>
            <Button 
              onClick={handleBookingClick}
              aria-label="Book your appointment on Fresha (opens in new tab)"
              className="px-6 py-2 text-sm font-semibold tracking-wide uppercase"
            >
              Book Now
            </Button>
          </div>
        </div>

        {/* Services by Category */}
        {Object.entries(servicesByCategory).map(([categoryKey, services]) => {
          const category = SERVICE_CATEGORIES[categoryKey as keyof typeof SERVICE_CATEGORIES];
          
          return (
            <section key={categoryKey} className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-wide uppercase">
                  {category.label}
                </h2>
                <div className="w-16 h-0.5 bg-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600 italic">{category.description}</p>
              </div>
              
              <div className="max-w-4xl mx-auto">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className={`flex justify-between items-center py-4 ${
                      index !== services.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {service.description}
                      </p>
                    </div>
                    
                    <div className="text-right ml-6 flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        {formatDuration(service.duration)}
                      </div>
                      <div className="text-lg font-bold text-gray-900 min-w-[60px]">
                        {formatPrice(service.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Call to Action */}
        <div className="text-center mt-16 pt-12 border-t border-gray-300">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-wide uppercase">
              Book Your Appointment
            </h2>
            <div className="w-16 h-0.5 bg-gray-900 mx-auto mb-6"></div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Schedule your visit with our experienced barbers.<br/>
              Professional service, traditional techniques.
            </p>
            <Button 
              size="lg"
              onClick={handleBookingClick}
              aria-label="Book your appointment on Fresha (opens in new tab)"
              className="px-8 py-3 text-base font-semibold tracking-wide uppercase"
            >
              Book Appointment
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              Online booking via Fresha
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Floating Booking Button */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 transform ${
          showStickyButton ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <Button 
          size="lg"
          onClick={handleBookingClick}
          aria-label="Quick book appointment (opens in new tab)"
          className="px-6 py-3 text-sm font-semibold tracking-wide uppercase shadow-lg hover:shadow-xl bg-gray-900 text-white border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-colors duration-200"
        >
          📅 Book Now
        </Button>
      </div>
    </div>
  );
};

export default React.memo(ServicesPage);