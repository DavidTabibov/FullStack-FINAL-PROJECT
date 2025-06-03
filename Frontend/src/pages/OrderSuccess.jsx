import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const orderData = location.state;

  if (!orderData) {
    return (
      <div className="container py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2>Order Not Found</h2>
            <p>No order information available.</p>
            <Link to="/" className="btn btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Success Header */}
          <div className="text-center mb-5">
            <div className="mb-4">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
            </div>
            <h1 className="h2 fw-bold text-success mb-2">Order Confirmed!</h1>
            <p className="text-muted fs-5">
              Thank you for your purchase. Your order has been successfully processed.
            </p>
            {orderData.isTestOrder && (
              <div className="alert alert-info mt-3">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Test Order:</strong> This order was placed using our test credit card with infinite funds.
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="h4 fw-bold mb-4">Order Details</h3>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="mb-3">
                    <strong>Order ID:</strong>
                    <div className="text-muted">{orderData.orderId}</div>
                  </div>
                  <div className="mb-3">
                    <strong>Order Date:</strong>
                    <div className="text-muted">
                      {new Date(orderData.orderDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <strong>Payment Method:</strong>
                    <div className="text-muted">{orderData.paymentInfo.cardType}</div>
                  </div>
                  <div className="mb-3">
                    <strong>Card Ending:</strong>
                    <div className="text-muted">****{orderData.paymentInfo.cardNumber}</div>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <h4 className="h5 fw-bold mb-3">Shipping Information</h4>
              <div className="bg-light p-3 rounded mb-4">
                <div className="row">
                  <div className="col-md-6">
                    <strong>{orderData.shippingInfo.firstName} {orderData.shippingInfo.lastName}</strong><br />
                    {orderData.shippingInfo.address}<br />
                    {orderData.shippingInfo.city}, {orderData.shippingInfo.postalCode}<br />
                    {orderData.shippingInfo.country}
                  </div>
                  <div className="col-md-6">
                    <strong>Contact:</strong><br />
                    {orderData.shippingInfo.email}<br />
                    {orderData.shippingInfo.phone}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <h4 className="h5 fw-bold mb-3">Order Items</h4>
              <div className="table-responsive">
                <table className="table table-borderless">
                  <tbody>
                    {orderData.items.map((item, index) => (
                      <tr key={index}>
                        <td style={{ width: '80px' }}>
                          <img
                            src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop&crop=center'}
                            alt={item.name}
                            className="rounded"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                        </td>
                        <td>
                          <div className="fw-medium">{item.name}</div>
                          <small className="text-muted">Quantity: {item.quantity}</small>
                        </td>
                        <td className="text-end">
                          <div className="fw-medium">${(item.price * item.quantity).toFixed(2)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Total */}
              <div className="border-top pt-3">
                <div className="row">
                  <div className="col-md-6"></div>
                  <div className="col-md-6">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>${(orderData.total / 1.17 - (orderData.total > 200 ? 0 : 25)).toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tax (17%):</span>
                      <span>${((orderData.total / 1.17 - (orderData.total > 200 ? 0 : 25)) * 0.17).toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping:</span>
                      <span>${orderData.total > 200 ? '0.00' : '25.00'}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold fs-5">
                      <span>Total:</span>
                      <span>${orderData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="text-center">
            <Link to="/products" className="btn btn-primary me-3">
              Continue Shopping
            </Link>
            <Link to="/" className="btn btn-outline-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 