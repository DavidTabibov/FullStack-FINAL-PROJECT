import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">Shipping Policy</h1>
            <p className="lead text-muted">
              Fast, reliable, and secure shipping to get your fashion favorites to you quickly.
            </p>
          </div>

          <div className="card shadow border-0">
            <div className="card-body p-4 p-lg-5">
              <div className="mb-4">
                <h3 className="h4 fw-bold text-primary mb-3">
                  <i className="bi bi-truck me-2"></i>
                  Shipping Options
                </h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <h5 className="fw-bold text-dark mb-2">Standard Shipping</h5>
                      <p className="text-muted mb-2">5-7 business days</p>
                      <p className="h5 text-success mb-0">FREE on orders $75+</p>
                      <small className="text-muted">$5.99 for orders under $75</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <h5 className="fw-bold text-dark mb-2">Express Shipping</h5>
                      <p className="text-muted mb-2">2-3 business days</p>
                      <p className="h5 text-primary mb-0">$9.99</p>
                      <small className="text-muted">All orders</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <h5 className="fw-bold text-dark mb-2">Next Day Delivery</h5>
                      <p className="text-muted mb-2">Next business day</p>
                      <p className="h5 text-warning mb-0">$19.99</p>
                      <small className="text-muted">Order by 2 PM EST</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <h5 className="fw-bold text-dark mb-2">International</h5>
                      <p className="text-muted mb-2">7-14 business days</p>
                      <p className="h5 text-info mb-0">Starting at $24.99</p>
                      <small className="text-muted">Varies by location</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="h5 fw-bold text-dark mb-3">Processing Time</h4>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-clock text-primary me-2"></i>
                    Orders placed before 2 PM EST ship same day
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-clock text-primary me-2"></i>
                    Orders placed after 2 PM EST ship next business day
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-clock text-primary me-2"></i>
                    Weekend orders process on Monday
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-clock text-primary me-2"></i>
                    Holiday processing may take 1-2 additional days
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="h5 fw-bold text-dark mb-3">Tracking Your Order</h4>
                <p className="mb-3">
                  Once your order ships, you'll receive a tracking number via email. 
                  You can also track your order status in your account dashboard.
                </p>
                <div className="bg-light rounded p-3">
                  <p className="mb-2">
                    <strong>Track your package:</strong>
                  </p>
                  <ul className="list-unstyled mb-0">
                    <li>• Email confirmation with tracking link</li>
                    <li>• Account dashboard order history</li>
                    <li>• SMS updates (opt-in required)</li>
                  </ul>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="h5 fw-bold text-dark mb-3">International Shipping</h4>
                <p className="mb-3">
                  We ship to over 50 countries worldwide. International orders may be subject to customs duties and taxes.
                </p>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <i className="bi bi-globe text-primary fs-2 mb-2"></i>
                      <h6 className="fw-bold">50+ Countries</h6>
                      <small className="text-muted">Worldwide delivery</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <i className="bi bi-shield-check text-success fs-2 mb-2"></i>
                      <h6 className="fw-bold">Secure Transit</h6>
                      <small className="text-muted">Fully insured</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <i className="bi bi-currency-exchange text-warning fs-2 mb-2"></i>
                      <h6 className="fw-bold">Duty Calculator</h6>
                      <small className="text-muted">Estimate at checkout</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-light rounded p-4">
                <h4 className="h5 fw-bold text-dark mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Important Information
                </h4>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                    Delivery times are estimates and may vary during peak seasons
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                    PO Box and APO addresses require standard shipping
                  </li>
                  <li className="mb-0">
                    <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                    Signature confirmation required for orders over $200
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-muted">
              Questions about shipping? 
              <a href="/contact" className="text-primary text-decoration-none ms-1">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy; 