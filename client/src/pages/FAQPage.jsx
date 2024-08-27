import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

const faqs = [
  {
    question: "What is Toota?",
    answer: "Toota is your ultimate solution for seamless transportation and logistics services, connecting you with a diverse fleet of vehicles and experienced drivers."
  },
  {
    question: "How do I become a driver?",
    answer: "To become a driver, simply visit the 'Become a Driver' page, fill out the application form, and we’ll get back to you with the next steps."
  },
  {
    question: "How does the bidding process work?",
    answer: "When you post a job, drivers will submit their bids. You can then review these bids and choose the one that best suits your needs."
  },
  {
    question: "What types of vehicles are available?",
    answer: "We offer a variety of vehicles including bakkies, 1 ton trucks, 1.5 ton trucks, 2 ton trucks, 4 ton trucks, and 8 ton trucks."
  },
  {
    question: "Is Toota available in my area?",
    answer: "Toota is expanding rapidly! Please check our service area map or contact us directly to see if we're available in your location."
  },
  {
    question: "How do I contact Toota?",
    answer: "You can reach us via email at info@tootapp.co.za or through our social media channels."
  },
];

const FAQPage = () => {
  return (
    <div>
      <Header />
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-[#f89f1b] mb-8">Frequently Asked Questions</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded shadow-md">
                <h3 className="text-2xl font-semibold mb-4 text-[#404042] flex items-center">
                  <FaQuestionCircle className="mr-2" />{faq.question}
                </h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FAQPage;

