import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getWishlist, removeFromWishlist, clearWishlist } from '../../services/wishlist';
import Loading from '../../components/common/Loading';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

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
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item from wishlist');
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await clearWishlist();
        setWishlistItems([]);
      } catch (err) {
        console.error('Error clearing wishlist:', err);
        alert('Failed to clear wishlist');
      }
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
    alert('Product added to cart!');
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
            className="btn btn-link text-danger p-0"
          >
            Clear All
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
              <div className="card border-0 shadow-sm h-100 product-card">
                {/* Product Image */}
                <div className="position-relative" style={{aspectRatio: '1/1'}}>
                  <img
                    src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop&crop=center'}
                    alt={product.name}
                    className="card-img-top w-100 h-100 object-cover"
                  />
                  
                  {/* Quick Actions */}
                  <div className="position-absolute top-0 end-0 p-2">
                    <button
                      onClick={() => handleRemoveItem(product._id)}
                      disabled={removingId === product._id}
                      className="btn btn-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                      style={{width: '32px', height: '32px'}}
                      title="Remove from wishlist"
                    >
                      {removingId === product._id ? (
                        <span className="spinner-border spinner-border-sm text-danger" role="status" aria-hidden="true"></span>
                      ) : (
                        <i className="bi bi-heart-fill text-danger"></i>
                      )}
                    </button>
                  </div>

                  {/* Sale Badge */}
                  {product.salePrice && (
                    <div className="position-absolute top-0 start-0 p-2">
                      <span className="badge bg-danger">
                        -{getDiscountPercentage(product)}%
                      </span>
                    </div>
                  )}

                  {/* Stock Status */}
                  {product.countInStock === 0 && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                      <span className="text-white fw-bold">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="card-body d-flex flex-column">
                  <h3 className="h6 fw-medium text-dark mb-1 text-truncate">
                    {product.name}
                  </h3>
                  <p className="text-muted small mb-2">{product.brand}</p>
                  
                  {/* Price */}
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span className="h5 fw-bold text-primary mb-0">
                      ${getDisplayPrice(product)}
                    </span>
                    {product.salePrice && (
                      <span className="small text-muted text-decoration-line-through">
                        ${product.price}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto">
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="btn btn-outline-secondary w-100 mb-2"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.countInStock === 0}
                      className="btn btn-primary w-100"
                    >
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