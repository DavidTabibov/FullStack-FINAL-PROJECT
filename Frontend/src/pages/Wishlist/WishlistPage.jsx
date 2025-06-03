import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { getWishlist, removeFromWishlist, clearWishlist } from '../../services/wishlist';
import Loading from '../../components/common/Loading';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setLoading(false);
      setWishlistItems([]);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const items = await getWishlist();
      setWishlistItems(items);
    } catch (err) {
      setError('Failed to load wishlist');
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setRemovingId(productId);
      await removeFromWishlist(productId);
      setWishlistItems(items => items.filter(item => item._id !== productId));
      showToast('Item removed from wishlist', 'success');
    } catch (err) {
      console.error('Error removing item:', err);
      showToast('Failed to remove item from wishlist', 'error');
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearWishlist = async () => {
    try {
      setClearing(true);
      await clearWishlist();
      setWishlistItems([]);
      showToast('Wishlist cleared successfully', 'success');
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      showToast('Failed to clear wishlist', 'error');
    } finally {
      setClearing(false);
    }
  };

  const handleAddToCart = (product) => {
    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0],
      size: product.sizes && product.sizes.length > 0 ? product.sizes[0].size : '',
      color: product.colors && product.colors.length > 0 ? product.colors[0].name : '',
      quantity: 1
    };

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists
    const existingItemIndex = existingCart.findIndex(
      item => item.productId === cartItem.productId
    );

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    showToast('Product added to cart!', 'success');
  };

  const getDisplayPrice = (product) => {
    return product.salePrice || product.price;
  };

  const getDiscountPercentage = (product) => {
    if (product.salePrice && product.price > product.salePrice) {
      return Math.round(((product.price - product.salePrice) / product.price) * 100);
    }
    return 0;
  };

  if (loading) return <Loading type="page" text="Loading wishlist..." />;

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <div className="display-1 mb-4">🔒</div>
        <h2 className="h3 fw-bold mb-4">Please Login</h2>
        <p className="text-muted mb-4">
          You need to be logged in to view your wishlist
        </p>
        <button
          onClick={() => navigate('/login')}
          className="btn btn-primary btn-lg"
        >
          Login
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <h2 className="h3 fw-bold text-danger mb-4">Error</h2>
        <p className="text-muted mb-4">{error}</p>
        <button 
          onClick={fetchWishlist} 
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="display-5 fw-bold mb-2">My Wishlist</h1>
          <p className="text-muted">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        
        {wishlistItems.length > 0 && (
          <button
            onClick={handleClearWishlist}
            disabled={clearing}
            className="btn btn-link text-danger p-0"
          >
            {clearing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Clearing...
              </>
            ) : (
              'Clear All'
            )}
          </button>
        )}
      </div>

      {/* Wishlist Content */}
      {wishlistItems.length === 0 ? (
        <div className="text-center py-5">
          <div className="display-1 mb-4">🤍</div>
          <h2 className="h3 fw-bold mb-4">Your wishlist is empty</h2>
          <p className="text-muted mb-4">
            Save items you love by clicking the heart icon when browsing products
          </p>
          <button
            onClick={() => navigate('/products')}
            className="btn btn-primary btn-lg"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {wishlistItems.map((product) => (
            <div key={product._id} className="col-sm-6 col-lg-4 col-xl-3">
              <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                {/* Product Image */}
                <div className="position-relative bg-light" style={{height: '250px'}}>
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop&crop=center'}
                      alt={product.name}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop&crop=center';
                      }}
                    />
                  </Link>
                  
                  {/* Quick Actions */}
                  <div className="position-absolute top-0 end-0 p-3">
                    <button
                      onClick={() => handleRemoveItem(product._id)}
                      disabled={removingId === product._id}
                      className="btn btn-light btn-sm rounded-circle shadow-sm border-0 d-flex align-items-center justify-content-center"
                      style={{width: '42px', height: '42px'}}
                      title="Remove from wishlist"
                    >
                      {removingId === product._id ? (
                        <span className="spinner-border spinner-border-sm text-danger" role="status" aria-hidden="true"></span>
                      ) : (
                        <i className="bi bi-heart-fill text-danger fs-5"></i>
                      )}
                    </button>
                  </div>

                  {/* Sale Badge */}
                  {product.salePrice && (
                    <div className="position-absolute top-0 start-0 p-3">
                      <span className="badge bg-danger fw-bold rounded-pill px-3 py-2 shadow-sm">
                        -{getDiscountPercentage(product)}% OFF
                      </span>
                    </div>
                  )}

                  {/* Stock Status */}
                  {product.countInStock === 0 && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75">
                      <span className="badge bg-warning text-dark fs-6 fw-bold px-3 py-2">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="card-body d-flex flex-column p-4" style={{minHeight: '180px'}}>
                  {/* Brand */}
                  <div className="mb-2">
                    <small className="text-muted text-uppercase fw-bold" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>
                      {product.brand}
                    </small>
                  </div>
                  
                  {/* Product Name */}
                  <h5 className="card-title fw-bold text-dark mb-3 lh-sm" style={{
                    height: '3rem',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {product.name}
                  </h5>
                  
                  {/* Price */}
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <span className="h5 fw-bold text-primary mb-0">
                      ₪{getDisplayPrice(product)}
                    </span>
                    {product.salePrice && (
                      <small className="text-muted text-decoration-line-through">
                        ₪{product.price}
                      </small>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto d-grid gap-2">
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="btn btn-outline-primary btn-sm fw-semibold"
                    >
                      <i className="bi bi-eye me-2"></i>
                      View Details
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.countInStock === 0}
                      className="btn btn-primary btn-sm fw-semibold"
                    >
                      <i className="bi bi-cart-plus me-2"></i>
                      {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Continue Shopping */}
      {wishlistItems.length > 0 && (
        <div className="text-center mt-5">
          <button
            onClick={() => navigate('/products')}
            className="btn btn-outline-secondary btn-lg"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage; 