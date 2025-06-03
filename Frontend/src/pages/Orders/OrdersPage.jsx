import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

const OrdersPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  // Fetch user orders from localStorage (for demo purposes)
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        // Get all orders from localStorage
        const allOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        
        // Filter orders for current user
        const userSpecificOrders = allOrders.filter(order => 
          order.userId === user._id || order.userId === user.id || order.userEmail === user.email
        );
        
        // Transform orders to expected format
        const transformedOrders = userSpecificOrders.map(order => ({
          id: order.orderId,
          orderNumber: order.orderId.replace('ORD-', ''),
          date: order.orderDate,
          status: order.status || 'processing',
          total: order.total,
          items: order.items?.length || 0,
          shippingAddress: `${order.shippingInfo?.address || ''}, ${order.shippingInfo?.city || ''}, ${order.shippingInfo?.postalCode || ''}`,
          trackingNumber: null,
          isPaid: true,
          isDelivered: order.status === 'delivered',
          paidAt: order.orderDate,
          deliveredAt: order.status === 'delivered' ? order.orderDate : null,
          isTestOrder: order.isTestOrder || false,
          originalOrder: order, // Keep reference to original order data
          products: order.items?.map(item => ({
            id: item._id || item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || item.images?.[0] || `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=80&h=80&fit=crop&crop=center`
          })) || []
        }));

        setOrders(transformedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to load orders');
        showToast(err.message || 'Failed to load orders', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user, showToast]);

  // Handler for viewing order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Handler for canceling an order
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancellingOrderId(orderId);
    try {
      // Update order status in localStorage
      const allOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const updatedOrders = allOrders.map(order => 
        order.orderId === orderId 
          ? { ...order, status: 'cancelled' }
          : order
      );
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));

      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' }
          : order
      ));

      showToast('Order cancelled successfully', 'success');
    } catch (error) {
      console.error('Error cancelling order:', error);
      showToast('Failed to cancel order', 'error');
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Handler for reordering
  const handleReorder = (order) => {
    showToast('Reorder functionality will be implemented soon', 'info');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'secondary', text: 'Pending', icon: 'hourglass' },
      processing: { color: 'warning', text: 'Processing', icon: 'clock' },
      shipped: { color: 'info', text: 'Shipped', icon: 'truck' },
      delivered: { color: 'success', text: 'Delivered', icon: 'check-circle' },
      cancelled: { color: 'danger', text: 'Cancelled', icon: 'x-circle' }
    };

    const config = statusConfig[status] || statusConfig.processing;
    
    return (
      <span className={`badge bg-${config.color} d-inline-flex align-items-center`}>
        <i className={`bi bi-${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const getOrderStatusCounts = () => {
    return {
      all: orders.length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length
    };
  };

  const statusCounts = getOrderStatusCounts();

  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="mb-4">
              <i className="bi bi-person-x display-1 text-muted"></i>
            </div>
            <h2 className="h3 fw-bold mb-4">Please log in to view your orders</h2>
            <p className="text-muted mb-4">
              You need to be logged in to access your order history.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <a href="/login" className="btn btn-primary">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login
              </a>
              <a href="/register" className="btn btn-outline-primary">
                <i className="bi bi-person-plus me-2"></i>
                Register
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 fw-bold mb-1">Order History</h1>
              <p className="text-muted mb-0">
                {user ? `Welcome ${user.name?.first || user.firstName || 'User'}` : 'Track and manage your orders'}
              </p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary">
                <i className="bi bi-download me-2"></i>
                Export
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* Order Status Tabs */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <ul className="nav nav-pills" role="tablist">
                {[
                  { key: 'all', label: 'All Orders', count: statusCounts.all },
                  { key: 'processing', label: 'Processing', count: statusCounts.processing },
                  { key: 'shipped', label: 'Shipped', count: statusCounts.shipped },
                  { key: 'delivered', label: 'Delivered', count: statusCounts.delivered }
                ].map(tab => (
                  <li className="nav-item" key={tab.key}>
                    <button
                      className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label}
                      <span className="badge bg-light text-dark ms-2">{tab.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-3">Loading your orders...</p>
            </div>
          )}

          {/* Orders List */}
          {!loading && (
            <div className="row">
              {filteredOrders.length === 0 ? (
                <div className="col-12">
                  <div className="text-center py-5">
                    <i className="bi bi-cart-x display-1 text-muted"></i>
                    <h3 className="h4 mt-3">No orders found</h3>
                    <p className="text-muted">
                      {activeTab === 'all' 
                        ? "You haven't placed any orders yet." 
                        : `No ${activeTab} orders found.`
                      }
                    </p>
                    <Link to="/products" className="btn btn-primary mt-3">
                      <i className="bi bi-shop me-2"></i>
                      Start Shopping
                    </Link>
                  </div>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div key={order.id} className="col-12 mb-4">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-light d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">Order #{order.orderNumber}</h5>
                          <small className="text-muted">
                            Placed on {new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </small>
                        </div>
                        <div className="text-end">
                          {getStatusBadge(order.status)}
                          <div className="mt-1">
                            <strong>${order.total?.toFixed(2) || '0.00'}</strong>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card-body">
                        {/* Order Items */}
                        <div className="row mb-3">
                          <div className="col-md-8">
                            <h6 className="mb-3">Items ({order.items})</h6>
                            {order.products?.length > 0 ? (
                              order.products.map(product => (
                                <div key={product.id} className="d-flex align-items-center mb-3">
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="rounded me-3"
                                    style={{width: '60px', height: '60px', objectFit: 'cover'}}
                                    onError={(e) => {
                                      e.target.src = `https://picsum.photos/60/60?random=${product.id}`;
                                    }}
                                  />
                                  <div className="flex-grow-1">
                                    <h6 className="mb-1">{product.name}</h6>
                                    <small className="text-muted">Quantity: {product.quantity}</small>
                                  </div>
                                  <div className="text-end">
                                    <strong>${product.price?.toFixed(2) || '0.00'}</strong>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-muted">No items found for this order</p>
                            )}
                          </div>
                          
                          <div className="col-md-4">
                            <h6 className="mb-3">Shipping Address</h6>
                            <p className="text-muted small mb-3">{order.shippingAddress}</p>
                            
                            {order.trackingNumber && (
                              <div className="mb-3">
                                <h6 className="mb-2">Tracking</h6>
                                <p className="small">
                                  <strong>{order.trackingNumber}</strong>
                                  <br />
                                  <a href="#" className="text-primary">Track Package</a>
                                </p>
                              </div>
                            )}

                            {/* Payment & Delivery Status */}
                            <div className="mb-3">
                              <h6 className="mb-2">Status</h6>
                              <div className="small">
                                <div className="mb-1">
                                  <span className={`badge ${order.isPaid ? 'bg-success' : 'bg-warning'}`}>
                                    {order.isPaid ? 'Paid' : 'Pending Payment'}
                                  </span>
                                </div>
                                {order.isPaid && order.paidAt && (
                                  <small className="text-muted d-block">
                                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                                  </small>
                                )}
                                {order.isDelivered && order.deliveredAt && (
                                  <small className="text-success d-block">
                                    Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                                  </small>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="border-top pt-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleViewDetails(order)}
                              >
                                <i className="bi bi-eye me-1"></i>
                                View Details
                              </button>
                              {order.status === 'delivered' && (
                                <button 
                                  className="btn btn-outline-secondary btn-sm" 
                                  onClick={() => handleReorder(order)}
                                >
                                  <i className="bi bi-arrow-repeat me-1"></i>
                                  Reorder
                                </button>
                              )}
                              {(order.status === 'pending' || order.status === 'processing') && (
                                <button 
                                  className="btn btn-outline-danger btn-sm" 
                                  onClick={() => handleCancelOrder(order.id)}
                                  disabled={cancellingOrderId === order.id}
                                >
                                  {cancellingOrderId === order.id ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                      Cancelling...
                                    </>
                                  ) : (
                                    <>
                                      <i className="bi bi-x-circle me-1"></i>
                                      Cancel
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                            <div className="text-muted small">
                              Last updated: {new Date(order.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order Details - #{selectedOrder.orderNumber}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Order Summary */}
                <div className="mb-4">
                  <h6 className="fw-bold">Order Summary</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                      <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                      <p><strong>Status:</strong> {getStatusBadge(selectedOrder.status)}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Total:</strong> ${selectedOrder.total?.toFixed(2)}</p>
                      <p><strong>Payment:</strong> <span className="badge bg-success">Paid</span></p>
                      {selectedOrder.isTestOrder && (
                        <p><strong>Order Type:</strong> <span className="badge bg-info">Test Order</span></p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="mb-4">
                  <h6 className="fw-bold">Shipping Information</h6>
                  <div className="bg-light p-3 rounded">
                    {selectedOrder.originalOrder?.shippingInfo && (
                      <>
                        <p className="mb-1">
                          <strong>{selectedOrder.originalOrder.shippingInfo.firstName} {selectedOrder.originalOrder.shippingInfo.lastName}</strong>
                        </p>
                        <p className="mb-1">{selectedOrder.originalOrder.shippingInfo.address}</p>
                        <p className="mb-1">{selectedOrder.originalOrder.shippingInfo.city}, {selectedOrder.originalOrder.shippingInfo.postalCode}</p>
                        <p className="mb-1">{selectedOrder.originalOrder.shippingInfo.country}</p>
                        <p className="mb-1"><strong>Email:</strong> {selectedOrder.originalOrder.shippingInfo.email}</p>
                        <p className="mb-0"><strong>Phone:</strong> {selectedOrder.originalOrder.shippingInfo.phone}</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h6 className="fw-bold">Order Items</h6>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th className="text-end">Price</th>
                          <th className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.products?.map(product => (
                          <tr key={product.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="rounded me-3"
                                  style={{width: '50px', height: '50px', objectFit: 'cover'}}
                                />
                                <div>
                                  <h6 className="mb-0">{product.name}</h6>
                                </div>
                              </div>
                            </td>
                            <td>{product.quantity}</td>
                            <td className="text-end">${product.price?.toFixed(2)}</td>
                            <td className="text-end"><strong>${(product.price * product.quantity).toFixed(2)}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="border-top">
                        <tr>
                          <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                          <td className="text-end"><strong>${selectedOrder.total?.toFixed(2)}</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Payment Information */}
                {selectedOrder.originalOrder?.paymentInfo && (
                  <div className="mb-4">
                    <h6 className="fw-bold">Payment Information</h6>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-1"><strong>Payment Method:</strong> {selectedOrder.originalOrder.paymentInfo.cardType}</p>
                      <p className="mb-0"><strong>Card:</strong> ****{selectedOrder.originalOrder.paymentInfo.cardNumber}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
                {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={() => {
                      handleCancelOrder(selectedOrder.id);
                      setShowDetailsModal(false);
                    }}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 