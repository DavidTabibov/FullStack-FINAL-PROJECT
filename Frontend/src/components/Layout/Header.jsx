// components/Layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const { user, logout, isAdmin } = useAuth();
  const { showToast } = useToast();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const closeNav = () => setIsNavCollapsed(true);

  useEffect(() => {
    setIsNavCollapsed(true);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      navigate('/');
      closeNav();
    } catch (error) {
      showToast('Error logging out', 'error');
    }
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Get user's first name safely
  const getDisplayName = () => {
    if (!user) return '';
    return user.name?.first || user.firstName || 'User';
  };

  return (
    <header className="bg-white shadow-sm sticky-top">
      <nav className="navbar navbar-expand-lg navbar-light py-3">
        <div className="container">
          {/* Brand */}
          <Link className="navbar-brand d-flex align-items-center text-decoration-none" to="/">
            <span className="fs-2 me-2">✨</span>
            <span className="fw-bold fs-4" style={{ color: '#6366f1' }}>
              Luxe <span style={{ color: '#d97706' }}>Boutique</span>
            </span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            onClick={handleNavCollapse}
            aria-controls="navbarNav"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
            style={{ fontSize: '1.25rem' }}
          >
            <i className={`bi ${isNavCollapsed ? 'bi-list' : 'bi-x'}`}></i>
          </button>

          {/* Navigation */}
          <div className={`collapse navbar-collapse ${!isNavCollapsed ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav ms-auto me-4">
              <li className="nav-item">
                <Link
                  className={`nav-link fw-medium px-3 py-2 rounded-pill d-flex align-items-center ${
                    isActive('/') ? 'bg-primary text-white' : 'text-dark hover-bg-primary'
                  }`}
                  to="/"
                  onClick={closeNav}
                  style={{ 
                    transition: '0.3s',
                    backgroundColor: isActive('/') ? '#312e81' : 'transparent',
                    color: isActive('/') ? '#ffffff' : '#1f2937'
                  }}
                >
                  <i className="bi bi-house-door me-2"></i>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link fw-medium px-3 py-2 rounded-pill d-flex align-items-center ${
                    isActive('/products') ? 'bg-primary text-white' : 'text-dark hover-bg-primary'
                  }`}
                  to="/products"
                  onClick={closeNav}
                  style={{ 
                    transition: '0.3s',
                    backgroundColor: isActive('/products') ? '#312e81' : 'transparent',
                    color: isActive('/products') ? '#ffffff' : '#1f2937'
                  }}
                >
                  <i className="bi bi-grid me-2"></i>
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link fw-medium px-3 py-2 rounded-pill d-flex align-items-center ${
                    isActive('/about') ? 'bg-primary text-white' : 'text-dark hover-bg-primary'
                  }`}
                  to="/about"
                  onClick={closeNav}
                  style={{ 
                    transition: '0.3s',
                    backgroundColor: isActive('/about') ? '#312e81' : 'transparent',
                    color: isActive('/about') ? '#ffffff' : '#1f2937'
                  }}
                >
                  <i className="bi bi-info-circle me-2"></i>
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link fw-medium px-3 py-2 rounded-pill d-flex align-items-center ${
                    isActive('/contact') ? 'bg-primary text-white' : 'text-dark hover-bg-primary'
                  }`}
                  to="/contact"
                  onClick={closeNav}
                  style={{ 
                    transition: '0.3s',
                    backgroundColor: isActive('/contact') ? '#312e81' : 'transparent',
                    color: isActive('/contact') ? '#ffffff' : '#1f2937'
                  }}
                >
                  <i className="bi bi-telephone me-2"></i>
                  Contact
                </Link>
              </li>
            </ul>

            {/* User Actions */}
            <div className="d-flex align-items-center gap-2">
              <Link
                to="/cart"
                className="btn btn-outline-primary position-relative d-none d-lg-flex align-items-center justify-content-center"
                style={{ width: '45px', height: '45px', borderRadius: '50%' }}
                onClick={closeNav}
                aria-label={`Shopping cart with ${itemCount} items`}
                title={`Shopping Cart (${itemCount} items)`}
              >
                <i className="bi bi-bag fs-5" aria-hidden="true"></i>
                {itemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark" style={{ fontSize: '0.7rem' }} aria-hidden="true">
                    {itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="dropdown">
                  <button
                    className="btn btn-primary dropdown-toggle d-flex align-items-center"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ borderRadius: '25px' }}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    {getDisplayName()}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
                    <li>
                      <Link className="dropdown-item" to="/profile" onClick={closeNav}>
                        <i className="bi bi-person me-2"></i>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/orders" onClick={closeNav}>
                        <i className="bi bi-box-seam me-2"></i>
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/wishlist" onClick={closeNav}>
                        <i className="bi bi-heart me-2"></i>
                        Favorites
                      </Link>
                    </li>
                    {isAdmin && (
                      <>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <Link className="dropdown-item text-primary fw-semibold" to="/admin/dashboard" onClick={closeNav}>
                            <i className="bi bi-speedometer2 me-2"></i>
                            Admin Dashboard
                          </Link>
                        </li>
                      </>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary px-4"
                  onClick={closeNav}
                  style={{ borderRadius: '25px' }}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;