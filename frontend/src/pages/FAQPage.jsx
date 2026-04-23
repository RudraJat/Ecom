import React from 'react';
import PageHeader from '../components/PageHeader';

const FAQPage = () => {
  return (
    <div className="page-wrapper">
      <PageHeader 
        title="Frequently Asked Questions" 
        subtitle="Find answers to common questions about our products, orders, and services."
      />
      <div className="content-section container">
        <div className="static-content-wrapper glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
          
          <div className="faq-item">
            <h3 className="faq-question">What payment methods do you accept?</h3>
            <p className="faq-answer">We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All transactions are securely encrypted.</p>
          </div>
          
          <div className="faq-item">
            <h3 className="faq-question">How can I track my order?</h3>
            <p className="faq-answer">Once your order ships, you will receive a confirmation email with a tracking number. You can also view your order status by logging into your account.</p>
          </div>
          
          <div className="faq-item">
            <h3 className="faq-question">Do you offer international shipping?</h3>
            <p className="faq-answer">Yes, we ship globally to most countries. International shipping rates and times vary depending on the destination. Customs fees may apply.</p>
          </div>
          
          <div className="faq-item">
            <h3 className="faq-question">Are your products covered by a warranty?</h3>
            <p className="faq-answer">Absolutely. All AURA electronics and audio products come with a standard 1-year limited warranty covering manufacturing defects.</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
