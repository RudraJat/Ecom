import React from 'react';
import PageHeader from '../components/PageHeader';

const ReturnsPage = () => {
  return (
    <div className="page-wrapper">
      <PageHeader 
        title="Returns & Exchanges" 
        subtitle="Our commitment to your satisfaction. Learn about our hassle-free return process."
      />
      <div className="content-section container">
        <div className="static-content-wrapper glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
          
          <h2>30-Day Return Policy</h2>
          <p>We want you to love your AURA experience. If you are not completely satisfied with your purchase, you can return it within 30 days of delivery for a full refund or exchange.</p>
          
          <h2>Conditions for Return</h2>
          <ul>
            <li>Items must be returned in their original condition and packaging.</li>
            <li>All accessories, manuals, and parts included with the product must be returned.</li>
            <li>Products showing signs of wear, damage, or alteration may not be accepted or may be subject to a restocking fee.</li>
          </ul>

          <h2>How to Initiate a Return</h2>
          <p>To start a return, please follow these steps:</p>
          <ol style={{ paddingLeft: '20px', color: 'var(--text-secondary)', marginBottom: '1.2rem', lineHeight: '1.8' }}>
            <li>Log into your account and navigate to your Order History.</li>
            <li>Select the item(s) you wish to return and choose a reason.</li>
            <li>Print the provided prepaid return shipping label.</li>
            <li>Package the item securely and drop it off at the designated carrier.</li>
          </ol>

          <h2>Refund Processing</h2>
          <p>Once we receive and inspect your return, we will process your refund to the original payment method. Please allow 5-7 business days for the credit to appear on your statement.</p>

        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;
