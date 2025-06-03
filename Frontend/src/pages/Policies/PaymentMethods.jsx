import React from 'react';

const PaymentMethods = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">Payment Methods</h1>
            <p className="lead text-muted">
              Secure, convenient, and flexible payment options for a seamless shopping experience.
            </p>
          </div>

          <div className="card shadow border-0">
            <div className="card-body p-4 p-lg-5">
              <div className="mb-4">
                <h3 className="h4 fw-bold text-primary mb-3">
                  <i className="bi bi-credit-card me-2"></i>
                  Accepted Payment Methods
                </h3>
                <div className="row g-3 mb-4">
                  <div className="col-md-3 col-6">
                    <div className="text-center p-3 border rounded h-100">
                      <i className="bi bi-credit-card text-primary fs-1 mb-2"></i>
                      <h6 className="fw-bold mb-1">Credit Cards</h6>
                      <small className="text-muted">Visa, Mastercard, Amex</small>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="text-center p-3 border rounded h-100">
                      <i className="bi bi-paypal text-info fs-1 mb-2"></i>
                      <h6 className="fw-bold mb-1">PayPal</h6>
                      <small className="text-muted">Secure & Fast</small>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="text-center p-3 border rounded h-100">
                      <i className="bi bi-apple text-dark fs-1 mb-2"></i>
                      <h6 className="fw-bold mb-1">Apple Pay</h6>
                      <small className="text-muted">Touch ID & Face ID</small>
                    </div>
                  </div>
                  <div className="col-md-3 col-6">
                    <div className="text-center p-3 border rounded h-100">
                      <i className="bi bi-google text-success fs-1 mb-2"></i>
                      <h6 className="fw-bold mb-1">Google Pay</h6>
                      <small className="text-muted">Quick Checkout</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="h5 fw-bold text-dark mb-3">Security & Protection</h4>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-shield-lock-fill text-success fs-4 me-3 mt-1"></i>
                      <div>
                        <h6 className="fw-bold mb-1">SSL Encryption</h6>
                        <small className="text-muted">256-bit SSL security for all transactions</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-check-circle-fill text-success fs-4 me-3 mt-1"></i>
                      <div>
                        <h6 className="fw-bold mb-1">PCI Compliant</h6>
                        <small className="text-muted">Industry standard security protocols</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-eye-slash-fill text-success fs-4 me-3 mt-1"></i>
                      <div>
                        <h6 className="fw-bold mb-1">No Data Storage</h6>
                        <small className="text-muted">We never store your payment details</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="h5 fw-bold text-dark mb-3">Buy Now, Pay Later Options</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-calendar-check text-primary fs-4 me-2"></i>
                        <h6 className="fw-bold mb-0">Klarna</h6>
                      </div>
                      <p className="text-muted mb-2">Pay in 4 interest-free installments</p>
                      <small className="text-success">No credit check required</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="border rounded p-3 h-100">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-cash-coin text-warning fs-4 me-2"></i>
                        <h6 className="fw-bold mb-0">Afterpay</h6>
                      </div>
                      <p className="text-muted mb-2">Split purchases into 4 payments</p>
                      <small className="text-success">Available for orders $35-$1000</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="h5 fw-bold text-dark mb-3">Billing Information</h4>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-check text-success me-2"></i>
                    All prices are displayed in USD
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check text-success me-2"></i>
                    Billing address must match payment method
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check text-success me-2"></i>
                    Payment is processed when order is placed
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check text-success me-2"></i>
                    Email receipt sent immediately after purchase
                  </li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="h5 fw-bold text-dark mb-3">International Payments</h4>
                <p className="mb-3">
                  We accept international credit cards and PayPal from customers worldwide. 
                  Currency conversion is handled automatically at checkout.
                </p>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <i className="bi bi-currency-exchange text-info fs-3 mb-2"></i>
                      <h6 className="fw-bold">Auto Conversion</h6>
                      <small className="text-muted">Real-time exchange rates</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <i className="bi bi-shield-check text-success fs-3 mb-2"></i>
                      <h6 className="fw-bold">Fraud Protection</h6>
                      <small className="text-muted">Advanced fraud detection</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="text-center p-3 border rounded">
                      <i className="bi bi-headset text-primary fs-3 mb-2"></i>
                      <h6 className="fw-bold">24/7 Support</h6>
                      <small className="text-muted">Payment assistance available</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-light rounded p-4">
                <h4 className="h5 fw-bold text-dark mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Payment FAQ
                </h4>
                <div className="accordion" id="paymentFAQ">
                  <div className="accordion-item border-0 mb-2">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                        When is my payment processed?
                      </button>
                    </h2>
                    <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#paymentFAQ">
                      <div className="accordion-body bg-white">
                        Payment is processed immediately when you place your order. You'll receive an email confirmation within minutes.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item border-0">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                        What if my payment fails?
                      </button>
                    </h2>
                    <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#paymentFAQ">
                      <div className="accordion-body bg-white">
                        If payment fails, check your card details and try again. Contact your bank if issues persist, or try an alternative payment method.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <p className="text-muted">
              Payment questions or issues? 
              <a href="/contact" className="text-primary text-decoration-none ms-1">Contact our payment support team</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods; 