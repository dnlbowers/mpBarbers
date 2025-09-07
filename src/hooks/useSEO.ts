import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: readonly string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'business.business';
  siteName?: string;
  locale?: string;
}

/**
 * SEO Optimization Hook
 * 
 * @description Provides dynamic meta tag management for search engine optimization
 * and social media sharing. Automatically updates document head with appropriate
 * meta tags, Open Graph properties, and Twitter Card data for enhanced discoverability.
 * 
 * @param props - SEO configuration object
 * 
 * @example
 * ```tsx
 * const BookingPage: React.FC = () => {
 *   useSEO({
 *     title: 'Book Appointment',
 *     description: 'Schedule your professional barber service',
 *     keywords: ['book appointment', 'barber', 'haircut'],
 *     type: 'website'
 *   });
 * 
 *   return <div>Page content</div>;
 * };
 * ```
 */
export const useSEO = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  siteName = 'MP Barbers',
  locale = 'en_US'
}: SEOProps): void => {
  useEffect(() => {
    /**
     * Updates or creates meta tags in document head
     * @description Manages meta tag creation and updates with proper cleanup
     * to prevent duplicate tags and ensure optimal SEO performance
     * 
     * @param name - Meta tag name or property
     * @param content - Meta tag content value
     * @param property - Whether to use property attribute instead of name
     */
    const updateMetaTag = (name: string, content: string, property = false): void => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    if (title) {
      document.title = `${title} | ${siteName}`;
      updateMetaTag('og:title', title, true);
      updateMetaTag('twitter:title', title);
    }

    if (description) {
      updateMetaTag('description', description);
      updateMetaTag('og:description', description, true);
      updateMetaTag('twitter:description', description);
    }

    if (keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '));
    }

    if (image) {
      updateMetaTag('og:image', image, true);
      updateMetaTag('twitter:image', image);
    }

    if (url) {
      updateMetaTag('og:url', url, true);
      updateMetaTag('twitter:url', url);
    }

    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', siteName, true);
    updateMetaTag('og:locale', locale, true);
    updateMetaTag('twitter:card', 'summary_large_image');

    return () => {
      // Cleanup handled by React's effect cleanup
    };
  }, [title, description, keywords, image, url, type, siteName, locale]);
};

/**
 * Predefined SEO configurations for application pages
 * @description Centralized SEO configuration ensuring consistent optimization
 * across all application pages with business-specific keywords and descriptions
 */
export const SEO_CONFIGS = {
  home: {
    title: 'Modern Barbershop - Classic Service, Contemporary Style',
    description: 'Experience premium men\'s grooming at MP Barbers. Professional haircuts, beard trims, and hot shaves in a modern setting. Book your appointment today.',
    keywords: ['barbershop', 'mens haircut', 'beard trim', 'hot shave', 'grooming', 'barber'],
    type: 'business.business' as const,
  },
  about: {
    title: 'About MP Barbers - Expert Team & Premium Service',
    description: 'Meet our team of master barbers with decades of combined experience. Learn about our commitment to exceptional grooming and customer service.',
    keywords: ['barber team', 'expert barbers', 'professional grooming', 'barbershop history'],
  },
  booking: {
    title: 'Book Appointment - MP Barbers Online Booking',
    description: 'Schedule your appointment online. Choose from haircuts, beard trims, hot shaves, and styling services. Easy online booking with instant confirmation.',
    keywords: ['book appointment', 'online booking', 'barbershop appointment', 'schedule haircut'],
  },
  contact: {
    title: 'Contact MP Barbers - Location, Hours & Information',
    description: 'Visit us downtown or get in touch. Find our location, business hours, phone number, and contact information. We\'re here to serve you.',
    keywords: ['contact barber', 'barbershop location', 'business hours', 'phone number'],
  },
} as const;

/**
 * Structured Data Hook for Rich Snippets
 * 
 * @description Manages JSON-LD structured data injection for enhanced search results.
 * Enables rich snippets, knowledge panels, and improved search engine understanding
 * of business information and services.
 * 
 * @param data - Structured data object following Schema.org format
 * 
 * @example
 * ```tsx
 * const BusinessPage: React.FC = () => {
 *   useStructuredData(BUSINESS_STRUCTURED_DATA);
 *   return <div>Business content</div>;
 * };
 * ```
 */
export const useStructuredData = (data: object): void => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [data]);
};

/**
 * Business Structured Data Configuration
 * @description Schema.org compliant structured data for local business SEO.
 * Provides comprehensive business information for search engines including
 * location, services, ratings, and contact information.
 */
export const BUSINESS_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'HairSalon',
  name: 'MP Barbers',
  description: 'Modern barbershop offering professional haircuts, beard trims, and grooming services',
  url: 'https://mpbarbers.com',
  telephone: '(555) 123-4567',
  email: 'hello@mpbarbers.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Main Street',
    addressLocality: 'Downtown District',
    addressRegion: 'New York',
    postalCode: '10001',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '40.7589',
    longitude: '-73.9851',
  },
  openingHours: [
    'Mo-Fr 09:00-18:00',
    'Sa 09:00-17:00',
  ],
  priceRange: '€€',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '127',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Barbershop Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Classic Cut',
          description: 'Traditional haircut with modern precision',
        },
        price: '35',
        priceCurrency: 'EUR',
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Beard Trim',
          description: 'Professional beard shaping and trimming',
        },
        price: '25',
        priceCurrency: 'EUR',
      },
    ],
  },
};