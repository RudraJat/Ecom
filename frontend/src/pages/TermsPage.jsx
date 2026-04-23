import React from 'react';
import PageHeader from '../components/PageHeader';

const TermsPage = () => {
  return (
    <div className="page-wrapper">
      <PageHeader 
        title="Terms of Service" 
        subtitle="Please read these terms carefully before using our platform."
      />
      <div className="content-section container">
        <div className="static-content-wrapper glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
          
          <h2>1. Introduction</h2>
          <p>Welcome to AURA. These Terms of Service govern your use of our website and services. By accessing or using our platform, you agree to be bound by these terms.</p>
          
          <h2>2. Use of Our Service</h2>
          <p>You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services:</p>
          <ul>
            <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent.</li>
            <li>To impersonate or attempt to impersonate AURA, an AURA employee, another user, or any other person or entity.</li>
          </ul>

          <h2>3. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of AURA and its licensors. The Service is protected by copyright, trademark, and other laws.</p>

          <h2>4. Product Information</h2>
          <p>We strive to display our products accurately. However, we do not warrant that product descriptions, colors, or other content available on the site are accurate, complete, reliable, current, or error-free.</p>
          
          <h2>5. Limitation of Liability</h2>
          <p>In no event shall AURA, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

        </div>
      </div>
    </div>
  );
};

export default TermsPage;
