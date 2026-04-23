import React from 'react';
import PageHeader from '../components/PageHeader';

const ContactPage = () => {
  return (
    <div className="page-wrapper">
      <PageHeader 
        title="Get in Touch" 
        subtitle="We're here to help. Reach out to our dedicated support team for any inquiries."
      />
      <div className="content-section container">
        <div className="grid-asymmetric">
          <div className="static-content-wrapper glass-panel animate-fade-in" style={{ gridColumn: 'span 7', margin: 0, width: '100%' }}>
            <h2>Send us a Message</h2>
            <form className="contact-form" style={{ marginTop: '2rem' }} onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" />
              </div>
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" />
              </div>
              <div className="input-group">
                <label>Subject</label>
                <input type="text" placeholder="How can we help?" />
              </div>
              <div className="input-group">
                <label>Message</label>
                <textarea 
                  placeholder="Type your message here..." 
                  style={{ 
                    background: 'var(--surface-light)', 
                    border: '1px solid var(--border-color)', 
                    padding: '14px 16px', 
                    borderRadius: '12px', 
                    color: 'var(--text-primary)', 
                    fontFamily: 'var(--font-main)',
                    minHeight: '150px',
                    resize: 'vertical'
                  }}
                ></textarea>
              </div>
              <button className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Send Message</button>
            </form>
          </div>
          
          <div className="static-content-wrapper glass-panel animate-fade-in" style={{ gridColumn: 'span 5', margin: 0, width: '100%', height: 'fit-content', animationDelay: '0.2s' }}>
            <h2>Contact Information</h2>
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Customer Support</h3>
              <p>Email: support@aura-premium.com<br/>Phone: +1 (800) 123-4567</p>
              
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '2rem' }}>Business Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM (EST)<br/>Weekend: Closed</p>
              
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginTop: '2rem' }}>Headquarters</h3>
              <p>123 Design Avenue<br/>New York, NY 10001<br/>United States</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
