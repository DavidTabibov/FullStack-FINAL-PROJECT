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
        <div className="product-card-wrapper">
            <Link to={`/products/${safeProduct._id}`} className="text-decoration-none">
                <div 
                    className="card product-card h-auto border-0 shadow-sm"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{ maxHeight: '400px' }}
                >
                    {/* Product Image */}
                    <div className="position-relative overflow-hidden" style={{ height: '220px' }}>
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
                        
                        {/* Overlay on hover */}
                        <div className={`product-overlay ${isHovered ? 'show' : ''}`}>
                            <div className="d-flex gap-2 justify-content-center align-items-center">
                                <button 
                                    className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px' }}
                                    onClick={handleToggleFavorite}
                                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    <i className={`bi ${isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart text-dark'} fs-5`}></i>
                                </button>
                                <button 
                                    className="btn btn-dark btn-sm px-3 py-2"
                                    onClick={handleAddToCart}
                                    style={{ fontSize: '0.85rem' }}
                                >
                                    <i className="bi bi-bag-plus me-1"></i>
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Product Badges */}
                        <div className="position-absolute top-0 start-0 p-2">
                            {safeProduct.isNew && (
                                <span className="badge bg-success rounded-pill me-1" style={{ fontSize: '0.7rem' }}>New</span>
                            )}
                            {safeProduct.isSale && (
                                <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.7rem' }}>Sale</span>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="card-body p-3">
                        {safeProduct.brand && (
                            <p className="text-muted small mb-1" style={{ fontSize: '0.75rem' }}>{safeProduct.brand}</p>
                        )}
                        <h6 className="card-title mb-2 fw-semibold" style={{ 
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
                        
                        {/* Rating */}
                        {safeProduct.rating > 0 && (
                            <div className="d-flex align-items-center mb-2">
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
                        )}

                        {/* Price */}
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
            </Link>
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
