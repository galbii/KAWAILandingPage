'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Where can I find piano sales in Houston?",
    answer: "Our KAWAI piano sales Houston event at our dealership offers the best selection of digital and acoustic pianos in the Greater Houston Area. We're Houston's trusted piano dealer with over 5 years of partnership with SHSU."
  },
  {
    question: "Do you have used pianos for sale in Houston?",
    answer: "Yes! Our Houston piano sale event features both new and carefully selected used pianos Houston families love. All used pianos are inspected by SHSU music faculty and come with warranties. Prices start at $949 for digital pianos."
  },
  {
    question: "What piano deals are available in Houston during the event?",
    answer: "Piano deals Houston residents can save up to $6,000 on premium KAWAI instruments. Our event features special pricing on digital pianos, upright pianos, and grand pianos, plus free delivery and tuning for early bird customers."
  },
  {
    question: "Do you offer piano lessons in Houston area?",
    answer: "While our primary focus is piano sales Houston, we can connect you with qualified piano teachers in the Houston area through our SHSU Music Department partnership. Many of our piano customers also take advantage of piano lessons Houston has to offer."
  },
  {
    question: "Where is your Houston piano store located?",
    answer: "Our Houston piano sale event takes place at our KAWAI Piano Gallery Houston showroom at 5800 Richmond Ave. As Houston's premier piano dealer, our convenient location makes it easy for Greater Houston Area families to shop for pianos."
  },
  {
    question: "What types of pianos are available at your Houston location?",
    answer: "Our piano store Houston event features KAWAI digital pianos, upright acoustic pianos, and grand pianos. From compact ES-120 models perfect for apartments to full-size GL-10 grand pianos, we have options for every Houston piano family."
  },
  {
    question: "Do you provide financing for piano purchases in Houston?",
    answer: "Yes! We offer financing options for our piano sales Houston event. Monthly payments start as low as $79 for digital pianos. Our financing makes premium KAWAI pianos accessible to all Houston families."
  },
  {
    question: "What makes your Houston piano sale different from other dealers?",
    answer: "Our partnership with Sam Houston State University's Music Department ensures every piano meets institutional quality standards. Unlike other piano dealers Houston offers, our instruments are faculty-approved and your purchase directly supports SHSU's music programs through our ongoing partnership."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our Houston piano sales event and KAWAI piano deals
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Have more questions about our Houston piano sales?
          </p>
          <button className="bg-kawai-red text-white px-8 py-3 rounded-lg font-medium hover:bg-kawai-red/90 transition-colors">
            Contact Our Piano Experts
          </button>
        </div>
      </div>
    </section>
  );
}