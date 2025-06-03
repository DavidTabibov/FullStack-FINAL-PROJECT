// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import AdminFavoritesManagement from './AdminFavoritesManagement';
import AdminUsersManagement from './AdminUsersManagement';
import AdminProductsManagement from './AdminProductsManagement';
import { getAllProducts } from '../../services/products';
import { useToast } from '../../context/ToastContext';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('stats');
    const { showToast } = useToast();
    const [pendingDeleteOrderId, setPendingDeleteOrderId] = useState(null);
    const [realStats, setRealStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalOrders: 0,
        revenue: 0,
        orderBreakdown: {
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        },
        productStats: [],
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const calculateRealStatistics = async () => {
            try {
                setLoading(true);

                // Get all orders from localStorage
                const allOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
                
                // Get all registered users from localStorage
                const allUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                
                // Get products from API
                let products = [];
                try {
                    products = await getAllProducts();
                } catch (error) {
                    console.warn('Could not fetch products from API, using empty array');
                    products = [];
                }

                // Calculate order statistics
                const orderBreakdown = allOrders.reduce((acc, order) => {
                    const status = order.status || 'processing';
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                }, { processing: 0, shipped: 0, delivered: 0, cancelled: 0 });

                // Calculate total revenue
                const revenue = allOrders
                    .filter(order => order.status !== 'cancelled')
                    .reduce((total, order) => total + (order.total || 0), 0);

                // Calculate product statistics (products sold)
                const productSales = {};
                allOrders
                    .filter(order => order.status !== 'cancelled')
                    .forEach(order => {
                        if (order.items && Array.isArray(order.items)) {
                            order.items.forEach(item => {
                                const productName = item.name || 'Unknown Product';
                                productSales[productName] = (productSales[productName] || 0) + (item.quantity || 1);
                            });
                        }
                    });

                // Sort products by sales and get top 5
                const topProducts = Object.entries(productSales)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([name, quantity]) => ({ name, quantity }));

                // Get recent orders (last 5)
                const recentOrders = allOrders
                    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                    .slice(0, 5);

                setRealStats({
                    totalProducts: products.length,
                    totalUsers: allUsers.length,
                    totalOrders: allOrders.length,
                    revenue: revenue,
                    orderBreakdown,
                    productStats: topProducts,
                    recentOrders
                });

            } catch (error) {
                console.error('Error calculating statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        calculateRealStatistics();
    }, []);

    // Toast-based delete order function
    const handleDeleteOrder = (orderId) => {
        const orderNumber = orderId?.replace('ORD-', '') || 'Unknown';
        
        if (pendingDeleteOrderId === orderId) {
            // Second click - actually delete the order
            try {
                // Get current orders
                let orders = JSON.parse(localStorage.getItem('userOrders') || '[]');
                
                // Filter out the specific order
                const initialCount = orders.length;
                orders = orders.filter(order => order.orderId !== orderId);
                
                if (orders.length < initialCount) {
                    // Save back to localStorage
                    localStorage.setItem('userOrders', JSON.stringify(orders));
                    
                    // Reset pending state
                    setPendingDeleteOrderId(null);
                    
                    // Show success toast
                    showToast(`Order #${orderNumber} deleted successfully! 🗑️`, 'success');
                    
                    // Recalculate statistics after a brief delay
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    showToast(`Order #${orderNumber} not found`, 'error');
                    setPendingDeleteOrderId(null);
                }
                
            } catch (error) {
                console.error('Error deleting order:', error);
                showToast('Failed to delete order. Please try again.', 'error');
                setPendingDeleteOrderId(null);
            }
        } else {
            // First click - show confirmation
            setPendingDeleteOrderId(orderId);
            showToast(`Click delete again to confirm removal of Order #${orderNumber}`, 'warning');
            
            // Auto-cancel confirmation after 5 seconds
            setTimeout(() => {
                if (pendingDeleteOrderId === orderId) {
                    setPendingDeleteOrderId(null);
                    showToast('Order deletion cancelled', 'info');
                }
            }, 5000);
        }
    };

    // Cancel deletion
    const handleCancelDelete = () => {
        setPendingDeleteOrderId(null);
        showToast('Order deletion cancelled', 'info');
    };

    const statsData = [
        { 
            title: 'Total Products', 
            value: realStats.totalProducts.toString(), 
            icon: 'bi-box', 
            color: 'bg-primary' 
        },
        { 
            title: 'Total Users', 
            value: realStats.totalUsers.toString(), 
            icon: 'bi-people', 
            color: 'bg-success' 
        },
        { 
            title: 'Total Orders', 
            value: realStats.totalOrders.toString(), 
            icon: 'bi-cart', 
            color: 'bg-warning' 
        },
        { 
            title: 'Revenue', 
            value: `$${realStats.revenue.toFixed(2)}`, 
            icon: 'bi-currency-dollar', 
            color: 'bg-info' 
        }
    ];

    return (
        <div className="container py-5">
            <h1 className="display-5 fw-bold text-dark mb-5">Admin Dashboard</h1>

            {/* Navigation Tabs */}
            <div className="mb-5">
                <ul className="nav nav-pills" id="adminTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
                            id="stats-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#stats"
                            type="button"
                            role="tab"
                            aria-controls="stats"
                            aria-selected={activeTab === 'stats'}
                            onClick={() => setActiveTab('stats')}
                        >
                            <i className="bi bi-graph-up me-2"></i>
                            Statistics
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
                            id="products-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#products"
                            type="button"
                            role="tab"
                            aria-controls="products"
                            aria-selected={activeTab === 'products'}
                            onClick={() => setActiveTab('products')}
                        >
                            <i className="bi bi-box me-2"></i>
                            Products
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                            id="users-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#users"
                            type="button"
                            role="tab"
                            aria-controls="users"
                            aria-selected={activeTab === 'users'}
                            onClick={() => setActiveTab('users')}
                        >
                            <i className="bi bi-people me-2"></i>
                            Users
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
                            id="favorites-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#favorites"
                            type="button"
                            role="tab"
                            aria-controls="favorites"
                            aria-selected={activeTab === 'favorites'}
                            onClick={() => setActiveTab('favorites')}
                        >
                            <i className="bi bi-heart-fill me-2"></i>
                            Favorites & Analytics
                        </button>
                    </li>
                </ul>
            </div>

            {/* Tab Content */}
            <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                    <div className="tab-content" id="adminTabsContent">
                        {activeTab === 'stats' && (
                            <div className="tab-pane fade show active" id="stats" role="tabpanel" aria-labelledby="stats-tab">
                                <h2 className="h4 fw-bold text-dark mb-4">Statistics Overview</h2>
                                
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="text-muted mt-3">Loading real-time statistics...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Main Statistics Cards */}
                                        <div className="row g-4 mb-5">
                                            {statsData.map((stat, index) => (
                                                <div key={index} className="col-sm-6 col-lg-3">
                                                    <StatsCard {...stat} />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Status Breakdown */}
                                        <div className="row g-4 mb-5">
                                            <div className="col-lg-6">
                                                <div className="card border-0 bg-light">
                                                    <div className="card-body">
                                                        <h5 className="card-title mb-3">
                                                            <i className="bi bi-pie-chart me-2 text-primary"></i>
                                                            Order Status Breakdown
                                                        </h5>
                                                        <div className="row g-3">
                                                            <div className="col-6">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-warning rounded-circle me-3" style={{width: '12px', height: '12px'}}></div>
                                                                    <div>
                                                                        <div className="fw-bold">{realStats.orderBreakdown.processing}</div>
                                                                        <small className="text-muted">Processing</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-info rounded-circle me-3" style={{width: '12px', height: '12px'}}></div>
                                                                    <div>
                                                                        <div className="fw-bold">{realStats.orderBreakdown.shipped}</div>
                                                                        <small className="text-muted">Shipped</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-success rounded-circle me-3" style={{width: '12px', height: '12px'}}></div>
                                                                    <div>
                                                                        <div className="fw-bold">{realStats.orderBreakdown.delivered}</div>
                                                                        <small className="text-muted">Delivered</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-danger rounded-circle me-3" style={{width: '12px', height: '12px'}}></div>
                                                                    <div>
                                                                        <div className="fw-bold">{realStats.orderBreakdown.cancelled}</div>
                                                                        <small className="text-muted">Cancelled</small>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Top Selling Products */}
                                            <div className="col-lg-6">
                                                <div className="card border-0 bg-light">
                                                    <div className="card-body">
                                                        <h5 className="card-title mb-3">
                                                            <i className="bi bi-trophy me-2 text-warning"></i>
                                                            Top Selling Products
                                                        </h5>
                                                        {realStats.productStats.length > 0 ? (
                                                            <div className="list-group list-group-flush">
                                                                {realStats.productStats.map((product, index) => (
                                                                    <div key={index} className="list-group-item bg-transparent border-0 px-0 py-2">
                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                            <div>
                                                                                <div className="fw-medium">{product.name}</div>
                                                                                <small className="text-muted">Rank #{index + 1}</small>
                                                                            </div>
                                                                            <span className="badge bg-primary rounded-pill">{product.quantity} sold</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-muted">No product sales data available</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recent Orders */}
                                        <div className="card border-0 bg-light">
                                            <div className="card-body">
                                                <h5 className="card-title mb-3">
                                                    <i className="bi bi-clock-history me-2 text-info"></i>
                                                    Recent Orders
                                                    {pendingDeleteOrderId && (
                                                        <button
                                                            className="btn btn-sm btn-outline-secondary ms-3"
                                                            onClick={handleCancelDelete}
                                                        >
                                                            <i className="bi bi-x-circle me-1"></i>
                                                            Cancel Deletion
                                                        </button>
                                                    )}
                                                </h5>
                                                {realStats.recentOrders.length > 0 ? (
                                                    <div className="table-responsive">
                                                        <table className="table table-hover">
                                                            <thead>
                                                                <tr>
                                                                    <th>Order ID</th>
                                                                    <th>Date</th>
                                                                    <th>Status</th>
                                                                    <th>Total</th>
                                                                    <th>Items</th>
                                                                    <th>Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {realStats.recentOrders.map((order, index) => (
                                                                    <tr key={index} className={pendingDeleteOrderId === order.orderId ? 'table-warning' : ''}>
                                                                        <td className="fw-medium">{order.orderId?.replace('ORD-', '') || 'N/A'}</td>
                                                                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                                                        <td>
                                                                            <span className={`badge ${
                                                                                order.status === 'delivered' ? 'bg-success' :
                                                                                order.status === 'shipped' ? 'bg-info' :
                                                                                order.status === 'processing' ? 'bg-warning' :
                                                                                'bg-danger'
                                                                            }`}>
                                                                                {order.status || 'processing'}
                                                                            </span>
                                                                        </td>
                                                                        <td>${(order.total || 0).toFixed(2)}</td>
                                                                        <td>{order.items?.length || 0}</td>
                                                                        <td>
                                                                            <button
                                                                                className={`btn btn-sm ${
                                                                                    pendingDeleteOrderId === order.orderId 
                                                                                        ? 'btn-danger' 
                                                                                        : 'btn-outline-danger'
                                                                                }`}
                                                                                onClick={() => handleDeleteOrder(order.orderId)}
                                                                                title={
                                                                                    pendingDeleteOrderId === order.orderId 
                                                                                        ? 'Click again to confirm deletion' 
                                                                                        : 'Delete Order'
                                                                                }
                                                                            >
                                                                                <i className={`bi ${
                                                                                    pendingDeleteOrderId === order.orderId 
                                                                                        ? 'bi-exclamation-triangle' 
                                                                                        : 'bi-trash'
                                                                                }`}></i>
                                                                                {pendingDeleteOrderId === order.orderId && (
                                                                                    <span className="ms-1">Confirm</span>
                                                                                )}
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <p className="text-muted">No recent orders found</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div className="tab-pane fade show active" id="products" role="tabpanel" aria-labelledby="products-tab">
                                <AdminProductsManagement />
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="tab-pane fade show active" id="users" role="tabpanel" aria-labelledby="users-tab">
                                <AdminUsersManagement />
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div className="tab-pane fade show active" id="favorites" role="tabpanel" aria-labelledby="favorites-tab">
                                <AdminFavoritesManagement />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;