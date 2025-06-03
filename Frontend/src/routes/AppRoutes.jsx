import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/common/Layout';

// Import page components
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderSuccess from '../pages/OrderSuccess';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import AboutPage from '../pages/About/AboutPage';
import ContactPage from '../pages/Contact/ContactPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import OrdersPage from '../pages/Orders/OrdersPage';
import WishlistPage from '../pages/Wishlist/WishlistPage';
import AdminDashboard from '../pages/Admin/AdminDashboard';

// Policy pages
import ReturnPolicy from '../pages/Policies/ReturnPolicy';
import ShippingPolicy from '../pages/Policies/ShippingPolicy';
import PaymentMethods from '../pages/Policies/PaymentMethods';

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Policy Pages */}
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        
        {/* Shopping */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        
        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        
        {/* User Account */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* 404 Page */}
        <Route path="*" element={
          <div className="container py-5 text-center">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="mb-4">
                  <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
                </div>
                <h1 className="display-4 fw-bold text-primary mb-3">404</h1>
                <h2 className="h4 mb-3">Page Not Found</h2>
                <p className="text-muted mb-4">
                  Sorry, the page you are looking for doesn't exist or has been moved.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                  <a href="/" className="btn btn-primary btn-lg">
                    <i className="bi bi-house me-2"></i>
                    Back to Home
                  </a>
                  <a href="/products" className="btn btn-outline-primary btn-lg">
                    <i className="bi bi-shop me-2"></i>
                    Browse Products
                  </a>
                </div>
              </div>
            </div>
          </div>
        } />
      </Routes>
    </Layout>
  );
};

export default AppRoutes; 