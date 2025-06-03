import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
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

  const [validationErrors, setValidationErrors] = useState({});

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
    
    // Clear previous validation errors
    setValidationErrors({});
    
    // Strict validation for shipping information
    if (!shippingInfo.firstName.trim()) {
      showToast('🚨 First name is required to process your order', 'warning');
      setValidationErrors(prev => ({...prev, firstName: true}));
      return;
    }
    
    if (!shippingInfo.lastName.trim()) {
      showToast('🚨 Last name is required to process your order', 'warning');
      setValidationErrors(prev => ({...prev, lastName: true}));
      return;
    }
    
    if (!shippingInfo.email.trim() || !shippingInfo.email.includes('@')) {
      showToast('📧 Please enter a valid email address for order confirmation', 'warning');
      setValidationErrors(prev => ({...prev, email: true}));
      return;
    }
    
    if (!shippingInfo.phone.trim() || shippingInfo.phone.length < 10) {
      showToast('📱 Please enter a valid phone number (minimum 10 digits) for delivery updates', 'warning');
      setValidationErrors(prev => ({...prev, phone: true}));
      return;
    }
    
    if (!shippingInfo.address.trim() || shippingInfo.address.length < 5) {
      showToast('🏠 Please enter a complete shipping address (minimum 5 characters)', 'warning');
      setValidationErrors(prev => ({...prev, address: true}));
      return;
    }
    
    if (!shippingInfo.city.trim()) {
      showToast('🏙️ City is required for accurate delivery', 'warning');
      setValidationErrors(prev => ({...prev, city: true}));
      return;
    }
    
    if (!shippingInfo.postalCode.trim() || shippingInfo.postalCode.length < 3) {
      showToast('📮 Please enter a valid postal/ZIP code for delivery', 'warning');
      setValidationErrors(prev => ({...prev, postalCode: true}));
      return;
    }
    
    if (!shippingInfo.country.trim()) {
      showToast('🌍 Please select your country for shipping calculation', 'warning');
      setValidationErrors(prev => ({...prev, country: true}));
      return;
    }
    
    showToast('✅ Shipping information saved! Proceeding to payment...', 'success');
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // Strict validation for payment information
    if (!paymentInfo.cardNumber.trim()) {
      showToast('💳 Credit card number is required to complete your purchase', 'warning');
      return;
    }
    
    if (!paymentInfo.cardName.trim()) {
      showToast('👤 Cardholder name is required as it appears on your card', 'warning');
      return;
    }
    
    if (!paymentInfo.expiryDate.trim()) {
      showToast('📅 Card expiry date is required (MM/YY format)', 'warning');
      return;
    }
    
    if (!paymentInfo.cvv.trim()) {
      showToast('🔒 CVV/CVC security code is required (3-4 digits on your card)', 'warning');
      return;
    }
    
    setLoading(true);

    try {
      // Check if using test card
      const cleanCardNumber = paymentInfo.cardNumber.replace(/\s/g, '');
      const isTestCard = cleanCardNumber === '4532123456789012';
      
      if (isTestCard) {
        // Validate test card details
        if (paymentInfo.expiryDate !== '12/28' || paymentInfo.cvv !== '123') {
          showToast('⚠️ Demo Mode: Please use test card details - Expiry: 12/28, CVV: 123', 'error');
          return;
        }
        // Simulate test card processing - always succeeds
        setTimeout(() => {
          setLoading(false);
          showToast('🎉 Payment successful! Order confirmed with test payment system', 'success');
          navigate('/order-success', { 
            state: { 
              orderData: {
                orderId: 'ORD-' + Date.now(),
                email: shippingInfo.email,
                total: calculateTotal(),
                items: cartItems,
                shippingAddress: shippingInfo,
                paymentInfo: {
                  cardNumber: paymentInfo.cardNumber.slice(-4),
                  cardType: 'Test Card (Infinite Funds)'
                }
              }
            } 
          });
        }, 2000);
      } else {
        // For non-test cards, simulate realistic payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        // High chance of failure for non-test cards (simulating real-world scenario)
        showToast('❌ Demo Mode: Payment declined. Please use test card 4532-1234-5678-9012 for demonstration', 'error');
        return;
      }
      
    } catch (error) {
      showToast(`💳 Payment processing failed: ${error.message}. Please try again or contact support.`, 'error');
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
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing Payment...
                          </>
                        ) : (
                          'Complete Order'
                        )}
                      </button>
                    </form>
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