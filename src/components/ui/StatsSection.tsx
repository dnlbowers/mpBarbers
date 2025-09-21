/**
 * Stats Section Component - Reusable statistics display
 * Shows key barbershop metrics with consistent styling
 */

import React from 'react';

interface StatsSectionProps {
  className?: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({ className = "py-20" }) => {
  return (
    <section
      className={`${className} bg-white`}
      aria-label="Company statistics"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 text-center max-w-2xl mx-auto">
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-2" aria-label="Years of experience">
              7+
            </div>
            <p className="text-gray-600">Years of Experience</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-2" aria-label="5 star customer service">
              5★
            </div>
            <p className="text-gray-600">Customer Service</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(StatsSection);