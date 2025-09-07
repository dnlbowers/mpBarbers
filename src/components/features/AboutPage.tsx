/**
 * About Page Component - Company information and team
 */

import React from 'react';
import { TEAM_MEMBERS } from '../../constants';
import Card from '../ui/Card';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-20">
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-12">
            ABOUT MP BARBERS
          </h1>
          
          <div className="prose prose-lg mx-auto text-center mb-12">
            <p className="text-gray-700 leading-relaxed mb-6">
              Founded in 2020, MP Barbers has quickly become the premier destination for modern men's grooming. 
              Our philosophy is simple: combine traditional barbering techniques with contemporary style to deliver 
              exceptional results every time.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Our team of master barbers brings decades of combined experience, ensuring that every cut, 
              trim, and shave meets the highest standards of precision and style.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
              <p className="text-gray-600">Happy Clients</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">4</div>
              <p className="text-gray-600">Expert Barbers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">5★</div>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">OUR TEAM</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map((member) => (
              <Card key={member.id} className="text-center">
                <div className="w-48 h-48 bg-gray-300 rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-600 mb-2">{member.title}</p>
                <div className="text-sm text-gray-500">
                  {member.specialties.join(', ')}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
