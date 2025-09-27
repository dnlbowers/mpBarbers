/**
 * About Page Component - Company information and team
 */

import React from 'react';
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
            Crafted by Legacy, Defined with Precision.
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
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">MEET OUR MASTER BARBER</h2>
          <Card className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative w-64 h-64 flex-shrink-0 rounded-full overflow-hidden shadow-xl">
                <img
                  src="/images/mario-master-barber-placeholder.webp"
                  alt="Mario Pulvirenti - Master Barber"
                  className="w-full h-full object-cover object-top scale-150"
                  style={{
                    objectPosition: '50% 15%',
                    filter: 'contrast(1.05) brightness(1.02)'
                  }}
                />
                <div className="absolute inset-0 ring-4 ring-black/5 rounded-full pointer-events-none" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Mario Pulvirenti</h3>
                <p className="text-xl text-gray-600 mb-4">Master Barber & Founder</p>
                <div className="prose prose-lg text-gray-700">
                  <p className="mb-4">
                    With nearly a decade of dedication to the craft, Mario Pulvirenti stands as a true artisan in the world of barbering. His journey began in Malta's most prestigious barbershop chains, where he didn't just learn the trade—he mastered it, absorbing techniques passed down through generations while developing his own signature style.
                  </p>
                  <p className="mb-4">
                    Mario's hands tell stories of countless transformations, each cut a testament to his unwavering commitment to excellence. His approach blends old-school precision with contemporary flair, creating looks that are both timeless and on-trend. Whether wielding scissors for a classic cut or a straight razor for the perfect shave, Mario treats each service as an art form.
                  </p>
                  <p className="mb-4">
                    What sets Mario apart isn't just his technical prowess—it's his intuitive understanding of what makes each client unique. He doesn't just cut hair; he crafts confidence, one precise stroke at a time. His warm personality and professional demeanor have earned him a loyal following of discerning gentlemen who refuse to trust their look to anyone else.
                  </p>
                  <p>
                    At MP Barbershop, Mario has created more than just a business—he's built a sanctuary where traditional barbering thrives, where every detail matters, and where each client leaves not just looking their best, but feeling it too.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
