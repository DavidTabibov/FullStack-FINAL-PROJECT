import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productsService from '../services/products';
import { useFavorites } from '../hooks/useFavorites';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Loading from '../components/common/Loading';
import OptimizedImage from '../components/common/OptimizedImage';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { favorites, toggleFavorite, isLoading: favLoading } = useFavorites();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productsService.getProduct(id);
      setProduct(data);
      // Set default selected color and size
      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0]._id || data.colors[0].name);
      }
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0].size);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      showToast('Please select a size', 'warning');
      return;
    }
    if (!selectedColor && product.colors && product.colors.length > 0) {
      showToast('Please select a color', 'warning');
      return;
    }

    // Use CartContext instead of direct localStorage manipulation
    const productWithOptions = {
      ...product,
      selectedSize,
      selectedColor,
      selectedQuantity: quantity
    };

    addToCart(productWithOptions);
    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // This would typically send to the backend
    showToast('Review submitted! (This feature requires backend implementation)', 'info');
    setNewReview({ rating: 5, comment: '' });
  };

  // Generate fallback images for kids products with rainbow theme
  const generateKidsImage = (name, index = 0) => {
    if (name?.toLowerCase().includes('rainbow') || name?.toLowerCase().includes('unicorn')) {
      // Use actual rainbow/unicorn themed images for rainbow unicorn dress
      const rainbowImages = [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop', // Colorful rainbow dress
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop', // Kids fashion colorful
        'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&h=500&fit=crop', // Rainbow colors fabric
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop', // Kids dress
      ];
      return rainbowImages[index % rainbowImages.length];
    }
    return `https://picsum.photos/500/500?random=kids${index}`;
  };

  const getImageSrc = (image, index = 0) => {
    if (image && typeof image === 'string' && image.trim() !== '') {
      return image;
    }
    
    // Generate category-specific fallback
    if (product?.name?.toLowerCase().includes('kids') || 
        product?.category?.toLowerCase().includes('kids') ||
        product?.name?.toLowerCase().includes('rainbow') ||
        product?.name?.toLowerCase().includes('unicorn')) {
      return generateKidsImage(product.name, index);
    }
    
    return `https://picsum.photos/500/500?random=product${index}`;
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`bi bi-star${i < rating ? '-fill' : ''} text-warning me-1`}></i>
    ));
  };

  const isFavorite = favorites.includes(product?._id);

  if (loading) return <Loading type="page" text="Loading product..." />;
  if (error) return (
    <div className="container py-5 text-center">
      <h2 className="h3 fw-bold text-danger mb-4">Error</h2>
      <p className="text-muted mb-4">{error}</p>
      <button 
        onClick={() => navigate('/products')} 
        className="btn btn-primary"
      >
        Back to Products
      </button>
    </div>
  );
  if (!product) return <div className="container py-5 text-center"><h2>Product not found</h2></div>;

  const discountPercentage = product.salePrice && product.price > product.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button onClick={() => navigate('/')} className="btn btn-link p-0 text-decoration-none">Home</button>
          </li>
          <li className="breadcrumb-item">
            <button onClick={() => navigate('/products')} className="btn btn-link p-0 text-decoration-none">Products</button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
        </ol>
      </nav>

      <div className="row g-5 mb-5">
        {/* Product Images */}
        <div className="col-lg-6">
          <div className="position-relative mb-3">
            <div className="rounded-3 overflow-hidden bg-light" style={{ aspectRatio: '1/1' }}>
              <OptimizedImage
                src={getImageSrc(product.images?.[selectedImage], selectedImage)}
                alt={product.name}
                width={500}
                height={500}
                priority={true}
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
            </div>
            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(product._id)}
              disabled={favLoading}
              className={`btn position-absolute top-0 end-0 m-3 rounded-circle ${
                isFavorite ? 'btn-danger' : 'btn-outline-light'
              }`}
              style={{ width: '48px', height: '48px' }}
            >
              <i className={`bi bi-heart${isFavorite ? '-fill' : ''}`}></i>
            </button>
          </div>
          {product.images && product.images.length > 1 && (
            <div className="d-flex gap-2 overflow-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`btn p-1 border flex-shrink-0 rounded-2 ${
                    selectedImage === index ? 'border-primary border-2' : 'border-secondary'
                  }`}
                  style={{ width: '80px', height: '80px' }}
                >
                  <OptimizedImage
                    src={getImageSrc(image, index)}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-100 h-100 rounded-1"
                    style={{ objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="col-lg-6">
          <div className="mb-4">
            <h1 className="h2 fw-bold mb-2">{product.name}</h1>
            <p className="text-muted fs-5">{product.brand}</p>
            <div className="d-flex align-items-center gap-2 mt-2">
              <div className="d-flex">
                {renderStars(Math.round(product.rating || 0))}
              </div>
              <span className="text-muted">({product.numReviews || 0} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="d-flex align-items-center gap-3 mb-2">
              <span className="h2 fw-bold text-primary mb-0">
                ${product.salePrice || product.price}
              </span>
              {product.salePrice && (
                <>
                  <span className="h4 text-muted text-decoration-line-through mb-0">${product.price}</span>
                  <span className="badge bg-danger fs-6">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>
            {product.countInStock > 0 ? (
              <p className="text-success fw-medium mb-0">
                <i className="bi bi-check-circle me-1"></i>
                In Stock ({product.countInStock} available)
              </p>
            ) : (
              <p className="text-danger fw-medium mb-0">
                <i className="bi bi-x-circle me-1"></i>
                Out of Stock
              </p>
            )}
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <h3 className="fw-medium mb-3">Color:</h3>
              <div className="d-flex gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color._id || color.name)}
                    className={`btn p-0 rounded-circle border-2 ${
                      selectedColor === (color._id || color.name) ? 'border-primary' : 'border-secondary'
                    }`}
                    style={{ 
                      backgroundColor: color.code || color.name,
                      width: '32px',
                      height: '32px'
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <h3 className="fw-medium mb-3">Size:</h3>
              <div className="row g-2">
                {product.sizes.map((sizeObj, index) => (
                  <div key={index} className="col-3">
                    <button
                      onClick={() => setSelectedSize(sizeObj.size)}
                      disabled={sizeObj.quantity === 0}
                      className={`btn w-100 ${
                        selectedSize === sizeObj.size
                          ? 'btn-primary'
                          : sizeObj.quantity === 0
                          ? 'btn-outline-secondary disabled'
                          : 'btn-outline-secondary'
                      }`}
                    >
                      {sizeObj.size}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-4">
            <h3 className="fw-medium mb-3">Quantity:</h3>
            <div className="d-flex align-items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{width: '32px', height: '32px'}}
              >
                <i className="bi bi-dash"></i>
              </button>
              <span className="fw-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                style={{width: '32px', height: '32px'}}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div>
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="btn btn-primary w-100 py-3"
            >
              {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="border-top pt-4">
        <ul className="nav nav-tabs" id="productTabs" role="tablist">
          {['description', 'reviews', 'details'].map((tab) => (
            <li key={tab} className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                id={`${tab}-tab`}
                data-bs-toggle="tab"
                data-bs-target={`#${tab}`}
                type="button"
                role="tab"
                aria-controls={tab}
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content py-4" id="productTabsContent">
          {activeTab === 'description' && (
            <div className="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
              <h3 className="h4 fw-bold mb-4">Product Description</h3>
              <p className="text-muted">
                {product.description || 'No description available for this product.'}
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tab-pane fade show active" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
              <h3 className="h4 fw-bold mb-4">Customer Reviews</h3>
              
              {product.reviews && product.reviews.length > 0 ? (
                <div className="mb-4">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="border-bottom pb-3 mb-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="fw-medium">{review.name}</span>
                        <div>{renderStars(review.rating)}</div>
                        <span className="text-muted small">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-4">No reviews yet. Be the first to review this product!</p>
              )}

              {/* Add Review Form */}
              <div className="card border-0 bg-light">
                <div className="card-body">
                  <h4 className="fw-bold mb-4">Write a Review</h4>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Rating:</label>
                      <div className="d-flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className={`btn btn-link p-0 fs-4 ${
                              star <= newReview.rating ? 'text-warning' : 'text-muted'
                            }`}
                          >
                            <i className="bi bi-star-fill"></i>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Comment:</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="form-control"
                        rows={4}
                        placeholder="Share your thoughts about this product..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="tab-pane fade show active" id="details" role="tabpanel" aria-labelledby="details-tab">
              <h3 className="h4 fw-bold mb-4">Product Details</h3>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <span className="fw-medium">Category:</span> {product.category}
                  </div>
                  <div className="mb-3">
                    <span className="fw-medium">Subcategory:</span> {product.subcategory}
                  </div>
                  <div className="mb-3">
                    <span className="fw-medium">Brand:</span> {product.brand}
                  </div>
                  {product.colors && product.colors.length > 0 && (
                    <div className="mb-3">
                      <span className="fw-medium">Available Colors:</span> {product.colors.map(c => c.name).join(', ')}
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mb-3">
                      <span className="fw-medium">Available Sizes:</span> {product.sizes.map(s => s.size).join(', ')}
                    </div>
                  )}
                  <div className="mb-3">
                    <span className="fw-medium">Stock:</span> {product.countInStock} pieces
                  </div>
                  <div className="mb-3">
                    <span className="fw-medium">SKU:</span> {product._id.slice(-8).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 