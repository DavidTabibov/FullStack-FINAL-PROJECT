import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item._id, item.selectedSize, item.selectedColor);
  };

  const handleUpdateQuantity = (item, newQuantity) => {
    updateQuantity(item._id, newQuantity, item.selectedSize, item.selectedColor);
  };

  const handleClearCart = () => {
    clearCart();
    showToast('Cart cleared successfully!', 'success');
  };

  const getProductImage = (item) => {
    // Check for images array first (for products)
    if (item.images && item.images.length > 0) {
      return item.images[0];
    }
    // Check for single image field
    if (item.image) {
      return item.image;
    }
    // Fallback to placeholder
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop&crop=center';
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'warning');
      return;
    }
    navigate('/checkout');
  };

  // Function to get the actual color name from color data
  const getColorName = (item) => {
    // If selectedColor is already a name/string (not an ID), return it
    if (item.selectedColor && typeof item.selectedColor === 'string' && item.selectedColor.length < 10) {
      return item.selectedColor;
    }
    
    // If the item has colors array and selectedColor is an ID, find the matching color
    if (item.colors && item.selectedColor) {
      const matchingColor = item.colors.find(color => 
        color._id === item.selectedColor || 
        color.name === item.selectedColor ||
        color.code === item.selectedColor
      );
      if (matchingColor) {
        return matchingColor.name;
      }
    }
    
    // If selectedColorName is available (from product details), use it
    if (item.selectedColorName) {
      return item.selectedColorName;
    }
    
    // Fallback
    return item.selectedColor || 'Default';
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <h1 className="h2 fw-bold mb-4">Shopping Cart</h1>
        <div className="text-center py-5">
          <div className="display-1 mb-4">🛒</div>
          <h2 className="h3 fw-bold mb-4">Your cart is empty</h2>
          <p className="text-muted mb-4">
            Looks like you haven't added anything to your cart yet
          </p>
          <button 
            onClick={() => navigate('/products')}
            className="btn btn-primary btn-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 fw-bold">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="btn btn-outline-danger"
        >
          Clear Cart
        </button>
      </div>

      <div className="row g-4">
        {/* Cart Items */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom">
              <h2 className="h5 mb-0">Cart Items ({cartItems.length})</h2>
            </div>
            
            <div className="card-body p-0">
              {cartItems.map((item, index) => {
                // Create a unique key for each cart item including variants
                const itemKey = `${item._id}-${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`;
                
                return (
                <div key={itemKey} className="d-flex align-items-start p-4 border-bottom">
                  {/* Product Image */}
                  <div className="flex-shrink-0 me-3">
                    <button
                      onClick={() => navigate(`/products/${item._id}`)}
                      className="btn p-0 border-0 bg-transparent"
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={getProductImage(item)}
                        alt={item.name}
                        className="rounded"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow-1 me-3">
                    <button
                      onClick={() => navigate(`/products/${item._id}`)}
                      className="btn p-0 border-0 bg-transparent text-start w-100"
                      style={{ cursor: 'pointer' }}
                    >
                      <h3 className="h6 fw-semibold mb-1 text-truncate text-dark">{item.name}</h3>
                    </button>
                    <div className="small text-muted mb-1">
                      {item.selectedSize && (
                        <span className="badge bg-light text-dark me-2">
                          <i className="bi bi-rulers me-1"></i>
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="badge bg-light text-dark">
                          <i className="bi bi-palette me-1"></i>
                          Color: {getColorName(item)}
                        </span>
                      )}
                    </div>
                    <p className="h6 fw-bold text-primary mb-0">${item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="d-flex align-items-center me-3">
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                      className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <i className="bi bi-dash"></i>
                    </button>
                    <span className="fw-medium mx-3" style={{ minWidth: '32px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                      className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-end me-3">
                    <p className="fw-semibold mb-0">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="btn btn-outline-danger btn-sm"
                    title="Remove item"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: '2rem' }}>
            <div className="card-header bg-white border-bottom">
              <h2 className="h5 mb-0">Order Summary</h2>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>${calculateTax(calculateSubtotal()).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between h5 fw-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn btn-primary w-100 mt-3"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              <button
                onClick={() => navigate('/products')}
                className="btn btn-outline-secondary w-100 mt-2"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 