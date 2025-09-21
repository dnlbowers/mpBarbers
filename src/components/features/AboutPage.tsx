/**
 * About Page Component - Company information and team
 */

import React from 'react';
import { TEAM_MEMBERS } from '../../constants';
import Card from '../ui/Card';
import StatsSection from '../ui/StatsSection';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-15">
      <section className="pt-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold text-center mb-8">
            MP BARBERSHOP
          </h1>

          <h2 className="text-2xl font-light text-center mb-12 text-gray-700 italic">
            Crafted with Legacy, Defined by Precision.
          </h2>

          <div className="prose prose-lg mx-auto mb-12">
            <p className="text-gray-700 leading-relaxed mb-6 text-justify">
              At MP Barbershop, the art of traditional barbering is not merely practiced; it is meticulously preserved and innovatively applied.
              Founded by Mario Pulvirenti, a craftsman whose professional journey began by honing his skills at one of Malta's leading barbershop chains,
              this establishment represents the culmination of a lifelong dedication to the profession. His experience at prestigious establishments
              serves as a foundational principle, a touchstone of the classic techniques and unwavering standards that define a master barber's work.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6 text-justify">
              Here, every visit transcends the ordinary, evolving into a sophisticated grooming experience designed to highlight individual style and ensure absolute comfort.
              Mario's skillful hands are guided by an innate understanding of form and a passion for detail, ensuring that each sharp haircut, precise skin fade,
              and soothing hot towel shave is a bespoke service tailored to the client. The environment is one of quiet refinement,
              a welcoming destination for self-care where one can indulge and emerge looking not just sharp, but truly polished and refined.
            </p>

            <p className="text-gray-700 leading-relaxed text-justify">
              Located on Triq il-Karmnu in Birkirkara, MP Barbershop provides a true gentleman's experience,
              blending the timeless heritage of a master craftsman with the tailored needs of contemporary life.
            </p>
          </div>

        </div>
      </section>

      <StatsSection className="pt-5 pb-14" />

      <section className="pt-12 pb-20 bg-gray-50">
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
