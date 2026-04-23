import React from 'react';
import PageHeader from '../components/PageHeader';

const PrivacyPage = () => {
  return (
    <div className="page-wrapper">
      <PageHeader 
        title="Privacy Policy" 
        subtitle="How we collect, use, and protect your personal information."
      />
      <div className="content-section container">
        <div className="static-content-wrapper glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
          
          <h2>Data Collection</h2>
          <p>We collect information you provide directly to us when you create an account, make a purchase, sign up for our newsletter, or contact customer support. This may include your name, email address, postal address, phone number, and payment information.</p>
          
          <h2>Use of Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process your transactions and manage your orders.</li>
            <li>Provide, maintain, and improve our services.</li>
            <li>Send you technical notices, updates, security alerts, and support messages.</li>
            <li>Communicate with you about products, services, offers, and events offered by AURA.</li>
          </ul>

          <h2>Data Protection</h2>
          <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, please be aware that no security measures are perfect or impenetrable.</p>

          <h2>Cookies and Tracking</h2>
          <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

          <h2>Third-Party Services</h2>
          <p>We may share your information with trusted third-party service providers that assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
