import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const AdminFavoritesManagement = () => {
  const [favoritesData, setFavoritesData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [favoritesResponse, usersResponse] = await Promise.all([
        axios.get('/api/users/admin/favorites-analytics', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/users/admin/users-favorites', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setFavoritesData(favoritesResponse.data.data || []);
      setUsersData(usersResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="display-6 fw-bold text-dark mb-4">
        <i className="bi bi-heart-fill text-danger me-2"></i>
        Favorites & Analytics Management
      </h1>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <i className="bi bi-star-fill me-2"></i>
            Popular Products
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-people-fill me-2"></i>
            User Statistics
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'products' && (
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Most Popular Favorites
              </h3>
            </div>
            <div className="card-body">
              {favoritesData.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-heart display-1 text-muted mb-3"></i>
                  <h4 className="text-muted">No data to display</h4>
                  <p className="text-muted">No products found in favorites yet</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Favorites Count</th>
                        <th>Popularity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {favoritesData.map((item, index) => (
                        <tr key={item.productId}>
                          <td className="fw-bold">{index + 1}</td>
                          <td>
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="rounded"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            ) : (
                              <div 
                                className="bg-light d-flex align-items-center justify-content-center rounded"
                                style={{ width: '50px', height: '50px' }}
                              >
                                <i className="bi bi-image text-muted"></i>
                              </div>
                            )}
                          </td>
                          <td className="fw-semibold">{item.name}</td>
                          <td>
                            <span className="badge bg-secondary">{item.category}</span>
                          </td>
                          <td className="fw-bold text-success">₪{item.price}</td>
                          <td>
                            <span className="badge bg-danger fs-6">
                              <i className="bi bi-heart-fill me-1"></i>
                              {item.count}
                            </span>
                          </td>
                          <td>
                            <div className="progress" style={{ width: '100px' }}>
                              <div 
                                className="progress-bar bg-danger" 
                                role="progressbar" 
                                style={{ width: `${Math.min((item.count / (favoritesData[0]?.count || 1)) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h3 className="card-title mb-0">
                <i className="bi bi-people me-2"></i>
                User Statistics
              </h3>
            </div>
            <div className="card-body">
              {usersData.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-people display-1 text-muted mb-3"></i>
                  <h4 className="text-muted">No data to display</h4>
                  <p className="text-muted">No users with favorites found yet</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Favorites Count</th>
                        <th>Registration Date</th>
                        <th>Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.map((user, index) => (
                        <tr key={user._id}>
                          <td className="fw-bold">{index + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                                {user.name?.first?.charAt(0) || user.email.charAt(0)}
                              </div>
                              {user.name ? `${user.name.first} ${user.name.last}` : 'Not Set'}
                            </div>
                          </td>
                          <td className="text-muted">{user.email}</td>
                          <td>
                            <span className="badge bg-info fs-6">
                              <i className="bi bi-heart-fill me-1"></i>
                              {user.favoritesCount}
                            </span>
                          </td>
                          <td className="text-muted">
                            {new Date(user.createdAt).toLocaleDateString('en-US')}
                          </td>
                          <td>
                            {user.favoritesCount > 5 ? (
                              <span className="badge bg-success">Very Active</span>
                            ) : user.favoritesCount > 0 ? (
                              <span className="badge bg-warning">Active</span>
                            ) : (
                              <span className="badge bg-secondary">Inactive</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card border-primary">
            <div className="card-body text-center">
              <i className="bi bi-star-fill text-primary display-4 mb-2"></i>
              <h5 className="card-title">Total Favorite Products</h5>
              <h3 className="text-primary">{favoritesData.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-success">
            <div className="card-body text-center">
              <i className="bi bi-people-fill text-success display-4 mb-2"></i>
              <h5 className="card-title">Users with Favorites</h5>
              <h3 className="text-success">{usersData.filter(u => u.favoritesCount > 0).length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-warning">
            <div className="card-body text-center">
              <i className="bi bi-heart-fill text-warning display-4 mb-2"></i>
              <h5 className="card-title">Average Favorites per User</h5>
              <h3 className="text-warning">
                {usersData.length > 0 ? 
                  Math.round(usersData.reduce((sum, u) => sum + u.favoritesCount, 0) / usersData.length * 10) / 10 
                  : 0}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFavoritesManagement; 