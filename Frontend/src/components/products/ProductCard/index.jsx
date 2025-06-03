import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import OptimizedImage from '../../common/OptimizedImage';
import './styles.css';

const ProductCard = ({ 
    product = {
        discount: 0,
        isNew: false,
        rating: 0,
        reviewCount: 0,
        images: [],
        sizes: [],
        colors: [],
        brand: ''
    }, 
    onAddToCart, 
    onToggleFavorite, 
    isFavorite = false 
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('he-IL', {
            style: 'currency',
            currency: 'ILS'
        }).format(price);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCart) {
            // Add default size and color if available
            const productWithDefaults = {
                ...product,
                selectedSize: product.sizes && product.sizes.length > 0 ? product.sizes[0].size : null,
                selectedColor: product.colors && product.colors.length > 0 ? 
                    (product.colors[0]._id || product.colors[0].name) : null,
                selectedColorName: product.colors && product.colors.length > 0 ? 
                    product.colors[0].name : null,
                selectedQuantity: 1
            };
            onAddToCart(productWithDefaults);
        }
    };

    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleFavorite) {
            onToggleFavorite(product._id);
        }
    };

    // Safe access to product properties
    const safeProduct = {
        ...product,
        isNew: product.isNew || false,
        isSale: product.isSale || false,
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        images: product.images || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        brand: product.brand || ''
    };

    return (
        <div className="product-card-wrapper h-100">
            <div 
                className="card product-card h-100 border-0 shadow-sm d-flex flex-column"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Product Image with Link */}
                <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
                    <Link to={`/products/${safeProduct._id}`} className="text-decoration-none">
                        <img
                            src={safeProduct.images[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop&crop=center'} 
                            alt={safeProduct.name || 'Product'}
                            className="w-100 h-100 product-image"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop&crop=center';
                            }}
                        />
                    </Link>
                    
                    {/* Overlay on hover - Only visible on hover */}
                    <div className={`product-overlay ${isHovered ? 'show' : ''}`}>
                        <div className="d-flex gap-3 justify-content-center align-items-center">
                            <button 
                                className={`btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center shadow`}
                                style={{ 
                                    width: '44px', 
                                    height: '44px',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={handleToggleFavorite}
                                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <i className={`bi ${isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart text-dark'}`} style={{ fontSize: '18px' }}></i>
                            </button>
                            <button 
                                className="btn btn-dark btn-sm px-4 py-2 shadow fw-semibold"
                                onClick={handleAddToCart}
                                style={{ 
                                    fontSize: '0.9rem',
                                    transition: 'all 0.3s ease',
                                    borderRadius: '25px'
                                }}
                            >
                                <i className="bi bi-bag-plus me-2"></i>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    
                    {/* Product Badges */}
                    <div className="position-absolute top-0 start-0 p-2" style={{ zIndex: 3 }}>
                        {safeProduct.isNew && (
                            <span className="badge bg-success rounded-pill me-1" style={{ fontSize: '0.7rem' }}>New</span>
                        )}
                        {safeProduct.isSale && (
                            <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.7rem' }}>Sale</span>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="card-body p-3 d-flex flex-column flex-grow-1">
                    {/* Brand */}
                    {safeProduct.brand && (
                        <p className="text-muted small mb-1" style={{ fontSize: '0.75rem' }}>{safeProduct.brand}</p>
                    )}
                    
                    {/* Product Title - Fixed height */}
                    <Link to={`/products/${safeProduct._id}`} className="text-decoration-none">
                        <h6 className="card-title mb-2 fw-semibold text-dark" style={{ 
                            fontSize: '0.9rem',
                            lineHeight: '1.3',
                            height: '2.6rem',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}>
                            {safeProduct.name || 'Product'}
                        </h6>
                    </Link>
                    
                    {/* Rating - Fixed height */}
                    <div className="mb-2" style={{ height: '1.5rem' }}>
                        {safeProduct.rating > 0 ? (
                            <div className="d-flex align-items-center">
                                <div className="d-flex me-2">
                                    {[...Array(5)].map((_, i) => (
                                        <i 
                                            key={i} 
                                            className={`bi ${i < Math.floor(safeProduct.rating) ? 'bi-star-fill' : 'bi-star'} text-warning`}
                                            style={{ fontSize: '0.7rem' }}
                                        ></i>
                                    ))}
                                </div>
                                {safeProduct.reviewCount > 0 && (
                                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>({safeProduct.reviewCount})</small>
                                )}
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>

                    {/* Price - Push to bottom */}
                    <div className="mt-auto">
                        {safeProduct.isSale && safeProduct.salePrice && safeProduct.salePrice < safeProduct.price ? (
                            <div className="d-flex align-items-center">
                                <span className="h6 mb-0 text-danger fw-bold me-2" style={{ fontSize: '1rem' }}>
                                    {formatPrice(safeProduct.salePrice)}
                                </span>
                                <small className="text-muted text-decoration-line-through" style={{ fontSize: '0.8rem' }}>
                                    {formatPrice(safeProduct.price)}
                                </small>
                            </div>
                        ) : (
                            <span className="h6 mb-0 text-dark fw-bold" style={{ fontSize: '1rem' }}>
                                {formatPrice(safeProduct.price || 0)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        brand: PropTypes.string,
        price: PropTypes.number.isRequired,
        salePrice: PropTypes.number,
        isNew: PropTypes.bool,
        isSale: PropTypes.bool,
        rating: PropTypes.number,
        reviewCount: PropTypes.number,
        images: PropTypes.arrayOf(PropTypes.string),
        sizes: PropTypes.arrayOf(PropTypes.shape({
            size: PropTypes.string,
            quantity: PropTypes.number
        })),
        colors: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            code: PropTypes.string
        }))
    }).isRequired,
    onAddToCart: PropTypes.func,
    onToggleFavorite: PropTypes.func,
    isFavorite: PropTypes.bool
};

export default ProductCard;
