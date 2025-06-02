import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Israel'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    setCartItems(items);

    // Pre-fill user information if available
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        firstName: user.name?.first || '',
        lastName: user.name?.last || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user, navigate]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.17; // 17% VAT in Israel
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 200 ? 0 : 25; // Free shipping over $200
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping();
    return subtotal + tax + shipping;
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart after successful order
      localStorage.removeItem('cart');
      
      // Redirect to success page
      navigate('/order-success', { 
        state: { 
          orderTotal: calculateTotal(),
          orderItems: cartItems 
        }
      });
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Progress Steps */}
          <div className="mb-5">
            <div className="d-flex align-items-center justify-content-center">
              <div className={`d-flex align-items-center ${currentStep >= 1 ? 'text-primary' : 'text-muted'}`}>
                <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                  currentStep >= 1 ? 'bg-primary text-white' : 'bg-light'
                }`} style={{width: '32px', height: '32px'}}>
                  1
                </div>
                <span className="ms-2 fw-medium">Shipping</span>
              </div>
              <div className={`mx-3 ${currentStep >= 2 ? 'bg-primary' : 'bg-light'}`} style={{width: '64px', height: '4px'}}></div>
              <div className={`d-flex align-items-center ${currentStep >= 2 ? 'text-primary' : 'text-muted'}`}>
                <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                  currentStep >= 2 ? 'bg-primary text-white' : 'bg-light'
                }`} style={{width: '32px', height: '32px'}}>
                  2
                </div>
                <span className="ms-2 fw-medium">Payment</span>
              </div>
              <div className={`mx-3 ${currentStep >= 3 ? 'bg-primary' : 'bg-light'}`} style={{width: '64px', height: '4px'}}></div>
              <div className={`d-flex align-items-center ${currentStep >= 3 ? 'text-primary' : 'text-muted'}`}>
                <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                  currentStep >= 3 ? 'bg-primary text-white' : 'bg-light'
                }`} style={{width: '32px', height: '32px'}}>
                  3
                </div>
                <span className="ms-2 fw-medium">Review</span>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Main Content */}
            <div className="col-lg-8">
              {currentStep === 1 && (
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h2 className="h3 fw-bold mb-4">Shipping Information</h2>
                    <form onSubmit={handleShippingSubmit}>
                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-medium">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingInfo.firstName}
                            onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-medium">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingInfo.lastName}
                            onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-medium">
                            Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={shippingInfo.email}
                            onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-medium">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            required
                            value={shippingInfo.phone}
                            onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">
                          Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                          className="form-control"
                        />
                      </div>

                      <div className="row g-3 mb-4">
                        <div className="col-md-4">
                          <label className="form-label fw-medium">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingInfo.city}
                            onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-medium">
                            Postal Code *
                          </label>
                          <input
                            type="text"
                            required
                            value={shippingInfo.postalCode}
                            onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-medium">
                            Country *
                          </label>
                          <select
                            required
                            value={shippingInfo.country}
                            onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                            className="form-select"
                          >
                            <option value="Israel">Israel</option>
                            <option value="USA">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="Canada">Canada</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-3"
                      >
                        Continue to Payment
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2 className="h3 fw-bold mb-0">Payment Information</h2>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="btn btn-link text-primary p-0"
                      >
                        ← Back to Shipping
                      </button>
                    </div>

                    <form onSubmit={handlePaymentSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-medium">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: formatCardNumber(e.target.value)})}
                          maxLength={19}
                          className="form-control"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                          className="form-control"
                        />
                      </div>

                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <label className="form-label fw-medium">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: formatExpiryDate(e.target.value)})}
                            maxLength={5}
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-medium">
                            CVV *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                            maxLength={4}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-3"
                      >
                        Continue to Review
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2 className="h3 fw-bold mb-0">Order Review</h2>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="btn btn-link text-primary p-0"
                      >
                        ← Back to Payment
                      </button>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h3 className="h5 fw-bold mb-3">Order Items</h3>
                      {cartItems.map((item, index) => (
                        <div key={index} className="d-flex align-items-center border-bottom pb-3 mb-3">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop&crop=center'}
                            alt={item.name}
                            className="rounded"
                            style={{width: '48px', height: '48px', objectFit: 'cover'}}
                          />
                          <div className="flex-grow-1 ms-3">
                            <h4 className="h6 mb-1">{item.name}</h4>
                            <p className="text-muted small mb-0">
                              {item.size && `Size: ${item.size}`}
                              {item.color && ` | Color: ${item.color}`}
                              {` | Qty: ${item.quantity}`}
                            </p>
                          </div>
                          <span className="fw-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Info */}
                    <div className="mb-4">
                      <h3 className="h5 fw-bold mb-3">Shipping Address</h3>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-1">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                        <p className="mb-1">{shippingInfo.address}</p>
                        <p className="mb-1">{shippingInfo.city}, {shippingInfo.postalCode}</p>
                        <p className="mb-0">{shippingInfo.country}</p>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="mb-4">
                      <h3 className="h5 fw-bold mb-3">Payment Method</h3>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-1">**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                        <p className="mb-0">{paymentInfo.cardName}</p>
                      </div>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="btn btn-success w-100 py-3"
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h3 className="h5 fw-bold mb-4">Order Summary</h3>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>${calculateShipping().toFixed(2)}</span>
                  </div>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span>Tax:</span>
                    <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between h5 fw-bold">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 