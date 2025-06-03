import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">Return Policy</h1>
            <p className="lead text-muted">
              Your satisfaction is our priority. Learn about our flexible return and exchange policy.
            </p>
          </div>

          <div className="card shadow border-0">
            <div className="card-body p-4 p-lg-5">
              <div className="mb-4">
                <h3 className="h4 fw-bold text-primary mb-3">
                  <i className="bi bi-arrow-repeat me-2"></i>
                  30-Day Return Policy
                </h3>
                <p className="mb-3">
                  We offer a hassle-free 30-day return policy. If you're not completely satisfied with your purchase, 
                  you can return it within 30 days of delivery for a full refund or exchange.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="h5 fw-bold text-dark mb-3">Return Conditions</h4>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Items must be in original condition with tags attached
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Original packaging and receipt required
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    No wear, stains, or alterations
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Items must be clean and odor-free
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="h5 fw-bold text-dark mb-3">How to Return</h4>
                <ol className="ps-3">
                  <li className="mb-2">Contact our customer service at info@luxeboutique.com</li>
                  <li className="mb-2">Receive your return authorization number</li>
                  <li className="mb-2">Pack items securely with original packaging</li>
                  <li className="mb-2">Ship using our prepaid return label</li>
                  <li className="mb-2">Track your return and receive refund within 5-7 business days</li>
                </ol>
              </div>

              <div className="mb-4">
                <h4 className="h5 fw-bold text-dark mb-3">Exchanges</h4>
                <p>
                  Need a different size or color? We offer free exchanges within 30 days. 
                  Simply follow the return process and specify your exchange preference.
                </p>
              </div>

              <div className="bg-light rounded p-4">
                <h4 className="h5 fw-bold text-dark mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Important Notes
                </h4>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                    Sale items are final sale and cannot be returned
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                    Personalized or customized items are non-returnable
                  </li>
                  <li className="mb-0">
                    <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                    International returns may be subject to additional fees
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-muted">
              Have questions about returns? 
              <a href="/contact" className="text-primary text-decoration-none ms-1">Contact our customer service team</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy; 