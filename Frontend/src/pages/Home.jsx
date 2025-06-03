import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../components/common/OptimizedImage';
import Loading from '../components/common/Loading';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../hooks/useAuth';
import { toggleFavorite, getFavoriteIds } from '../services/wishlist';
import api from '../services/api';
import '../styles/pages/Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use the dedicated featured products endpoint
        const response = await api.get('/products/featured');
        const productArray = Array.isArray(response.data) ? response.data : [];
        
        // Take up to 6 featured products for display
        setProducts(productArray.slice(0, 6));
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError('Unable to load products at the moment.');
        // Set fallback products for demo purposes
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch user's favorite product IDs
  useEffect(() => {
    const fetchFavorites = async () => {
      if (isAuthenticated) {
        try {
          setFavoritesLoading(true);
          const ids = await getFavoriteIds();
          setFavoriteIds(ids);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        } finally {
          setFavoritesLoading(false);
        }
      } else {
        setFavoriteIds([]);
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);

  const categories = [
    {
      name: "Women's Fashion",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
      link: "/products?category=women",
      alt: "Elegant woman in fashionable clothing showcasing women's collection",
      description: "Elegant & Contemporary"
    },
    {
      name: "Men's Fashion", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      link: "/products?category=men",
      alt: "Stylish man wearing contemporary men's fashion",
      description: "Modern & Sophisticated"
    },
    {
      name: "Kids' Collection",
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&w=500&h=600&fit=crop&crop=center", 
      link: "/products?category=kids",
      alt: "Happy children wearing colorful and comfortable kids' clothing",
      description: "Fun & Comfortable"
    }
  ];

  const features = [
    {
      icon: "🚚",
      title: "Free Shipping",
      description: "Free delivery on orders over $100",
      color: "primary"
    },
    {
      icon: "🔄", 
      title: "Easy Returns",
      description: "30-day hassle-free returns",
      color: "success"
    },
    {
      icon: "⭐",
      title: "Premium Quality", 
      description: "Curated collection of finest materials",
      color: "warning"
    },
    {
      icon: "💎",
      title: "Exclusive Designs",
      description: "Unique pieces from top designers",
      color: "info"
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }
    
    // Simulate newsletter signup (replace with actual API call later)
    showToast('Thank you for subscribing to our newsletter!', 'success');
    setEmail('');
  };

  const handleToggleFavorite = async (productId) => {
    if (!isAuthenticated) {
      showToast('Please login to add items to wishlist', 'warning');
      return;
    }

    try {
      await toggleFavorite(productId);
      
      // Update local state
      if (favoriteIds.includes(productId)) {
        setFavoriteIds(prev => prev.filter(id => id !== productId));
        showToast('Removed from wishlist', 'success');
      } else {
        setFavoriteIds(prev => [...prev, productId]);
        showToast('Added to wishlist', 'success');
      }
    } catch (error) {
      showToast('Failed to update wishlist', 'error');
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="min-vh-100">
      {/* Enhanced Hero Section */}
      <section className="hero-gradient text-white py-5 position-relative overflow-hidden">
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.3
          }}
        ></div>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)'
        }}></div>
        
        {/* Animated background elements */}
        <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
          <div className="position-absolute animate-blob" style={{top: '25%', left: '10%', width: '18rem', height: '18rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '50%', filter: 'blur(40px)'}}></div>
        </div>
        
        <div className="container position-relative text-center z-10" style={{minHeight: '80vh', display: 'flex', alignItems: 'center'}}>
          <div className="mx-auto" style={{maxWidth: '64rem'}}>
            <h1 className="display-1 fw-bold mb-4 leading-tight animate-fade-in">
              <span className="text-warning">
                Luxe Fashion
              </span>
              <span className="d-block text-white animate-slide-up">
                Boutique
              </span>
            </h1>
            <p className="fs-4 mb-5 mx-auto leading-relaxed text-light animate-fade-in-up" style={{maxWidth: '48rem'}}>
              Discover premium fashion and timeless elegance for the modern lifestyle. 
              Where style meets sophistication.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center animate-slide-up">
              <Link 
                to="/products"
                className="btn btn-warning btn-lg px-5 py-3 fw-semibold text-decoration-none"
              >
                Shop Now
              </Link>
              <Link 
                to="/products"
                className="btn btn-outline-light btn-lg px-5 py-3 fw-semibold text-decoration-none"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold mb-3 gradient-text">
              Shop by Category
            </h2>
            <p className="fs-5 text-muted mx-auto" style={{maxWidth: '32rem'}}>
              Explore our carefully curated collections designed for every style and occasion
            </p>
          </div>
          <div className="row g-4">
            {categories.map((category, index) => (
              <div key={index} className="col-md-4">
                <Link
                  to={category.link}
                  className="card card-hover border-0 text-decoration-none h-100 overflow-hidden"
                  style={{borderRadius: '24px'}}
                >
                  <div className="position-relative overflow-hidden" style={{height: '24rem'}}>
                    <OptimizedImage
                      src={category.image}
                      alt={category.alt}
                      className="w-100 h-100 object-cover"
                      width={500}
                      height={600}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="position-absolute bottom-0 start-0 end-0 p-4 text-white" style={{background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'}}>
                      <h3 className="h4 fw-bold mb-2">
                        {category.name}
                      </h3>
                      <p className="mb-3 text-light">
                        {category.description}
                      </p>
                      <div className="d-flex align-items-center text-warning">
                        <span className="me-2">Shop Now</span>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold mb-3 gradient-text">
              Why Choose Us
            </h2>
            <p className="fs-5 text-muted">
              Experience the difference with our premium services
            </p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-sm-6 col-lg-3">
                <div className="card text-center h-100 border-0 card-hover">
                  <div className="card-body p-4">
                    <div className={`fs-1 mb-3 text-${feature.color}`}>
                      {feature.icon}
                    </div>
                    <h3 className="card-title fw-bold mb-3">
                      {feature.title}
                    </h3>
                    <p className="card-text text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {products.length > 0 && (
        <section className="py-5 bg-light featured-products">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-4 fw-bold mb-3 gradient-text">
                Featured Products
              </h2>
              <p className="fs-5 text-muted">
                Discover our most popular items
              </p>
            </div>
            <div className="row g-3">
              {products.map((product, index) => (
                <div key={product._id} className="col-lg-4 col-md-6">
                  <div className="card card-hover border-0 h-100 overflow-hidden">
                    {/* Clickable Product Image */}
                    <Link 
                      to={`/products/${product._id}`} 
                      className="text-decoration-none"
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="position-relative overflow-hidden" style={{height: '12rem'}}>
                        {product.images && product.images.length > 0 ? (
                          <OptimizedImage
                            src={product.images[0]}
                            alt={product.name}
                            className="w-100 h-100 object-cover transition-opacity opacity-100"
                            style={{ transition: 'opacity 0.3s', objectFit: 'cover', objectPosition: 'center center' }}
                            width={400}
                            height={300}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                            <div className="text-center text-muted">
                              <svg width="48" height="48" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                              <p className="small mt-2">No Image</p>
                            </div>
                          </div>
                        )}
                        {/* Category Badge and Product Status Badges */}
                        <div className="position-absolute top-0 start-0 m-2">
                          {product.category && (
                            <span className="badge bg-primary text-white fw-semibold px-2 py-1 rounded-pill text-uppercase small me-2">
                              {product.category}
                            </span>
                          )}
F                          {/* For featured products section, only show Featured badge */}
                          <span className="badge bg-warning text-white fw-semibold px-2 py-1 rounded-pill text-uppercase small">
                            Featured
                          </span>
                        </div>
                        {/* Hover overlay for quick view */}
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-0 d-flex align-items-center justify-content-center opacity-0 transition-all" 
                             style={{ transition: 'all 0.3s ease' }}
                             onMouseEnter={(e) => {
                               e.currentTarget.classList.remove('bg-opacity-0', 'opacity-0');
                               e.currentTarget.classList.add('bg-opacity-50', 'opacity-100');
                             }}
                             onMouseLeave={(e) => {
                               e.currentTarget.classList.add('bg-opacity-0', 'opacity-0');
                               e.currentTarget.classList.remove('bg-opacity-50', 'opacity-100');
                             }}>
                          <div className="d-flex gap-2 align-items-center">
                            {/* Wishlist Heart Button */}
                            <button 
                              className={`btn btn-sm rounded-circle ${favoriteIds.includes(product._id) ? 'btn-danger' : 'btn-light'}`}
                              style={{ 
                                width: '40px', 
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleToggleFavorite(product._id);
                              }}
                              disabled={favoritesLoading}
                              title={favoriteIds.includes(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                              <i className={`bi ${
                                favoriteIds.includes(product._id) 
                                  ? 'bi-heart-fill' 
                                  : 'bi-heart'
                              }`} style={{ fontSize: '16px' }}></i>
                            </button>
                            
                            {/* View Details Button */}
                            <span className="btn btn-light btn-sm">
                              <i className="bi bi-eye me-1"></i>View Details
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="card-body p-3">
                      {/* Clickable Product Title */}
                      <Link 
                        to={`/products/${product._id}`}
                        className="text-decoration-none"
                        style={{ cursor: 'pointer' }}
                      >
                        <h5 className="card-title fw-bold mb-2 text-truncate text-dark">
                          {product.name}
                        </h5>
                      </Link>
                      <p className="card-text text-muted mb-2 small" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                        {product.description || 'Premium quality fashion piece crafted with attention to detail.'}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        {product.isSale && product.salePrice && product.salePrice < product.price ? (
                          <div className="d-flex align-items-center">
                            <span className="h5 fw-bold text-danger mb-0 me-2">
                              ${product.salePrice.toFixed(2)}
                            </span>
                            <small className="text-muted text-decoration-line-through">
                              ${product.price.toFixed(2)}
                            </small>
                          </div>
                        ) : (
                          <span className="h5 fw-bold text-primary mb-0">
                            ${product.price ? product.price.toFixed(2) : '0.00'}
                          </span>
                        )}
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
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
            <div className="text-center mt-4">
              <Link to="/products" className="btn btn-outline-primary btn-lg text-decoration-none">
                View All Products
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-5 hero-gradient text-white">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="text-center">
                <h2 className="display-5 fw-bold mb-3 text-warning">
                  Stay Updated
                </h2>
                <p className="fs-5 mb-4 text-light">
                  Subscribe to our newsletter and be the first to know about new collections and exclusive offers.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="d-flex flex-column flex-sm-row gap-3">
                  <input
                    type="email"
                    className="form-control form-control-lg flex-fill"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{borderRadius: '50px'}}
                  />
                  <button 
                    type="submit" 
                    className="btn btn-warning btn-lg px-4"
                    style={{borderRadius: '50px'}}
                  >
                    Subscribe
                  </button>
                </form>
                <p className="small text-light mt-3 opacity-75">
                  No spam, unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
