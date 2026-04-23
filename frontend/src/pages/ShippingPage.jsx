import React from 'react';
import PageHeader from '../components/PageHeader';

const ShippingPage = () => {
  return (
    <div className="page-wrapper">
      <PageHeader 
        title="Shipping Information" 
        subtitle="Everything you need to know about our delivery options, times, and rates."
      />
      <div className="content-section container">
        <div className="static-content-wrapper glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
          
          <h2>Domestic Shipping</h2>
          <p>We offer fast and reliable shipping across the United States. Orders are typically processed within 1-2 business days.</p>
          <ul>
            <li><strong>Standard Shipping (3-5 business days):</strong> Free on orders over $150. Otherwise, $9.99.</li>
            <li><strong>Expedited Shipping (2-3 business days):</strong> $19.99 flat rate.</li>
            <li><strong>Overnight Delivery (1 business day):</strong> $34.99 (Order must be placed by 12 PM EST).</li>
          </ul>

          <h2>International Shipping</h2>
          <p>AURA ships to over 50 countries worldwide. International orders are shipped via DHL Express or FedEx International.</p>
          <ul>
            <li><strong>Standard International (7-14 business days):</strong> Rates calculated at checkout based on destination.</li>
            <li><strong>Express International (3-5 business days):</strong> Premium expedited service with full tracking.</li>
          </ul>

          <h2>Order Tracking</h2>
          <p>As soon as your order leaves our warehouse, you will receive an email containing your tracking information. Please allow up to 24 hours for the tracking to update in the carrier's system.</p>

        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
