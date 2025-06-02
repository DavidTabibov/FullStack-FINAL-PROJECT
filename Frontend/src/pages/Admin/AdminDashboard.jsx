// src/pages/Admin/AdminDashboard.jsx
import React, { useState } from 'react';
import StatsCard from './StatsCard';
import AdminFavoritesManagement from './AdminFavoritesManagement';
import AdminUsersManagement from './AdminUsersManagement';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('stats');

    const statsData = [
        { title: 'Total Products', value: '150', icon: 'bi-box', color: 'bg-primary' },
        { title: 'Total Users', value: '1,234', icon: 'bi-people', color: 'bg-success' },
        { title: 'Total Orders', value: '567', icon: 'bi-cart', color: 'bg-warning' },
        { title: 'Revenue', value: '$12,345', icon: 'bi-currency-dollar', color: 'bg-info' }
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
                                <div className="row g-4">
                                    {statsData.map((stat, index) => (
                                        <div key={index} className="col-sm-6 col-lg-3">
                                            <StatsCard {...stat} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'products' && (
                            <div className="tab-pane fade show active" id="products" role="tabpanel" aria-labelledby="products-tab">
                                <h2 className="h4 fw-bold text-dark mb-4">Product Management</h2>
                                <div className="bg-light rounded p-5 text-center">
                                    <i className="bi bi-box display-1 text-primary mb-3"></i>
                                    <h3 className="h5 fw-semibold text-dark mb-2">Product Management</h3>
                                    <p className="text-muted">Manage your fashion inventory here.</p>
                                    <button className="btn btn-primary mt-3">
                                        Add New Product
                                    </button>
                                </div>
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