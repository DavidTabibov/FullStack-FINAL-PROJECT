import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import Loading from '../../components/common/Loading';
import '../../styles/pages/Home.css';

const Home = () => {
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      // Get featured products (first 8)
      setFeaturedProducts(products.slice(0, 8));
    }
  }, [products]);

  const categories = [
    { 
      name: 'Women', 
      icon: 'bi-person-dress', 
      path: '/products?category=women',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop'
    },
    { 
      name: 'Men', 
      icon: 'bi-person', 
      path: '/products?category=men',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    },
    { 
      name: 'Kids', 
      icon: 'bi-people', 
      path: '/products?category=kids',
      image: null // Using gradient instead
    },
    { 
      name: 'Accessories', 
      icon: 'bi-bag', 
      path: '/products?category=accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'
    }
  ];

  if (loading) return <Loading />;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5" style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold mb-4">
                Luxe Fashion
                <span className="d-block text-warning">Boutique</span>
              </h1>
              <p className="fs-5 mb-4 opacity-90">
                Discover premium fashion and timeless elegance for the modern lifestyle. 
                Where style meets sophistication.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link to="/products" className="btn btn-warning btn-lg px-5 py-3 fw-semibold rounded-pill">
                  Shop Now
                </Link>
                <Link to="/about" className="btn btn-outline-light btn-lg px-5 py-3 fw-semibold rounded-pill">
                  Explore Collection
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-image-placeholder bg-white bg-opacity-10 rounded-4 p-5">
                <i className="bi bi-bag-heart display-1 text-warning mb-3"></i>
                <h4 className="text-white">Premium Quality</h4>
                <p className="text-white-50">Curated collections for every style</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h1 fw-bold mb-3" style={{ color: '#6366f1' }}>Shop by Category</h2>
            <p className="fs-5 text-muted">Explore our carefully curated collections designed for every style and occasion</p>
          </div>
          <div className="row g-4">
            {categories.map((category) => (
              <div key={category.name} className="col-lg-3 col-md-6">
                <Link to={category.path} className="text-decoration-none">
                  <div className="card border-0 shadow-sm h-100 category-card overflow-hidden">
                    <div 
                      className="position-relative d-flex align-items-center justify-content-center" 
                      style={{ 
                        height: '200px',
                        backgroundImage: !category.image || category.name === 'Kids' 
                          ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                          : `url(${category.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {category.image && category.name !== 'Kids' && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25"></div>
                      )}
                      <i className={`${category.icon} display-4 text-white position-relative`} style={{zIndex: 10}}></i>
                    </div>
                    <div className="card-body text-center py-4">
                      <h5 className="card-title fw-bold text-dark mb-2">{category.name}</h5>
                      <p className="text-muted small mb-0">Explore Collection</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5 bg-light featured-products">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold mb-3 text-primary">Featured Products</h2>
            <p className="fs-5 text-muted">Discover our most popular items</p>
          </div>
          
          {error ? (
            <div className="alert alert-danger text-center border-0 shadow-sm">
              <h5 className="mb-2">Unable to load products</h5>
              <p className="mb-0">{error}</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="row g-3 mb-4">
              {featuredProducts.map((product) => (
                <div key={product._id} className="col-lg-3 col-md-6">
                  <div className="card border-0 h-100 shadow-sm card-hover overflow-hidden">
                    {/* Product Image */}
                    <div className="position-relative overflow-hidden" style={{ height: '180px' }}>
                      <img 
                        src={product.images && product.images[0] 
                          ? product.images[0] 
                          : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop&crop=center'
                        } 
                        alt={product.name || 'Product'} 
                        className="w-100 h-100 object-fit-cover transition-opacity opacity-100"
                        style={{ transition: 'opacity 0.3s', objectFit: 'cover', objectPosition: 'center center' }}
                        loading="lazy"
                      />
                      {/* Category Badge */}
                      <div className="position-absolute top-0 start-0 m-2">
                        <span className="badge bg-primary text-white fw-semibold px-2 py-1 rounded-pill text-uppercase small">
                          {product.category || 'Product'}
                        </span>
                      </div>
                      {/* Quick View on Hover */}
                      <div 
                        className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-0 d-flex align-items-center justify-content-center opacity-0" 
                        style={{ transition: 'all 0.3s ease' }} 
                        onMouseEnter={(e) => {
                          e.target.classList.remove('bg-opacity-0', 'opacity-0');
                          e.target.classList.add('bg-opacity-50', 'opacity-100');
                        }}
                        onMouseLeave={(e) => {
                          e.target.classList.add('bg-opacity-0', 'opacity-0');
                          e.target.classList.remove('bg-opacity-50', 'opacity-100');
                        }}
                      >
                        <Link to={`/products/${product._id}`} className="btn btn-light btn-sm">
                          <i className="bi bi-eye me-1"></i>Quick View
                        </Link>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body p-3">
                      {/* Product Title */}
                      <h5 className="card-title fw-bold mb-2 text-truncate">{product.name}</h5>
                      
                      {/* Product Description */}
                      {product.description && (
                        <p 
                          className="card-text text-muted mb-2 small" 
                          style={{ 
                            display: '-webkit-box', 
                            WebkitLineClamp: 2, 
                            WebkitBoxOrient: 'vertical', 
                            overflow: 'hidden' 
                          }}
                        >
                          {product.description}
                        </p>
                      )}

                      {/* Price and Button */}
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="h5 fw-bold text-primary mb-0">
                          ${product.price ? product.price.toFixed(2) : '0.00'}
                        </span>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                            showToast('Product added to cart!');
                            
                            // Button feedback
                            const btn = e.target;
                            const originalContent = btn.innerHTML;
                            btn.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i>Added!';
                            btn.classList.remove('btn-primary');
                            btn.classList.add('btn-success');
                            
                            setTimeout(() => {
                              btn.innerHTML = originalContent;
                              btn.classList.remove('btn-success');
                              btn.classList.add('btn-primary');
                            }, 2000);
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-bag-x display-1 text-muted"></i>
              </div>
              <h5 className="text-muted mb-2">No products available</h5>
              <p className="text-muted">Check back soon for new arrivals!</p>
            </div>
          )}

          <div className="text-center">
            <Link to="/products" className="btn btn-outline-primary btn-lg">
              View All Products
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-md-6 text-center">
              <div className="feature-item p-4">
                <div className="feature-icon mb-3">
                  <i className="bi bi-truck display-4 text-primary"></i>
                </div>
                <h5 className="fw-bold text-dark">Free Shipping</h5>
                <p className="text-muted small mb-0">On orders over $100</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="feature-item p-4">
                <div className="feature-icon mb-3">
                  <i className="bi bi-arrow-repeat display-4 text-primary"></i>
                </div>
                <h5 className="fw-bold text-dark">Easy Returns</h5>
                <p className="text-muted small mb-0">30-day return policy</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="feature-item p-4">
                <div className="feature-icon mb-3">
                  <i className="bi bi-headset display-4 text-primary"></i>
                </div>
                <h5 className="fw-bold text-dark">24/7 Support</h5>
                <p className="text-muted small mb-0">Always here to help</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="feature-item p-4">
                <div className="feature-icon mb-3">
                  <i className="bi bi-shield-check display-4 text-primary"></i>
                </div>
                <h5 className="fw-bold text-dark">Secure Payment</h5>
                <p className="text-muted small mb-0">Your data is protected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <h3 className="fw-bold mb-3">Stay Updated</h3>
              <p className="mb-4 opacity-90">Subscribe to our newsletter for the latest trends and exclusive offers</p>
              <div className="input-group input-group-lg">
                <input 
                  type="email" 
                  className="form-control border-0 rounded-start-pill" 
                  placeholder="Enter your email address"
                />
                <button className="btn btn-warning text-dark fw-semibold px-4 rounded-end-pill">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; / *   t r i g g e r   r e b u i l d   * / 
 
 