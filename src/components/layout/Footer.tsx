/**
 * Footer Component - Site footer with contact information
 * Accessible and responsive footer design
 */

import React from 'react';
import { CONTACT_INFO } from '../../constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-gray-900 text-white py-8"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-2">MP BARBERS</h3>
            <p className="text-gray-300">
              Classic Service. Contemporary Style.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <p>{CONTACT_INFO.phone}</p>
              <p>{CONTACT_INFO.email}</p>
              <address className="not-italic">
                {CONTACT_INFO.address.street}<br />
                {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state} {CONTACT_INFO.address.zipCode}
              </address>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              {CONTACT_INFO.socialMedia.instagram && (
                <a
                  href={`https://instagram.com/${CONTACT_INFO.socialMedia.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Follow us on Instagram"
                >
                  <span className="text-2xl">📷</span>
                </a>
              )}
              {CONTACT_INFO.socialMedia.facebook && (
                <a
                  href={`https://facebook.com/${CONTACT_INFO.socialMedia.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <span className="text-2xl">📘</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-300">
            &copy; {currentYear} MP Barbers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
