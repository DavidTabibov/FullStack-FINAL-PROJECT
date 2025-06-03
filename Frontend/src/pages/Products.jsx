import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/common/Loading';
import Pagination from '../components/common/Pagination';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { toggleFavorite, getFavoriteIds } from '../services/wishlist';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { showToast } = useToast();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'women', label: "Women's Fashion" },
    { value: 'men', label: "Men's Fashion" },
    { value: 'kids', label: "Kids' Collection" },
    { value: 'accessories', label: 'Accessories' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'price-high', label: 'Price (High to Low)' },
    { value: 'newest', label: 'Newest First' },
  ];

  // Handle URL parameters for category
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch with larger limit to get all products
        const response = await api.get('/products?limit=1000');
        const data = response.data;
        const productArray = Array.isArray(data) ? data : (data.products || []);
        
        console.log('Fetched products:', productArray.length); // Debug log
        setProducts(productArray);
        setFilteredProducts(productArray);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Unable to load products at the moment.');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setFavoriteIds([]);
        return;
      }
      
      try {
        const ids = await getFavoriteIds();
        setFavoriteIds(ids);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setFavoriteIds([]);
      }
    };

    fetchProducts();
    fetchFavorites();
  }, [isAuthenticated]);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category with strict matching
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        const productCategory = product.category?.toLowerCase().trim() || '';
        const selectedCat = selectedCategory.toLowerCase().trim();
        
        // Exact match first
        if (productCategory === selectedCat) {
          return true;
        }
        
        // Strict category matching to prevent cross-contamination
        switch (selectedCat) {
          case 'women':
            return productCategory === 'women' || 
                   productCategory === 'womens' || 
                   productCategory === 'female' || 
                   productCategory === 'ladies' ||
                   (productCategory.startsWith('women') && !productCategory.includes('men'));
          case 'men':
            return productCategory === 'men' || 
                   productCategory === 'mens' || 
                   productCategory === 'male' || 
                   productCategory === 'guys' ||
                   (productCategory.startsWith('men') && !productCategory.includes('women'));
          case 'kids':
            return productCategory === 'kids' || 
                   productCategory === 'children' || 
                   productCategory === 'child' ||
                   productCategory === 'kids';
          case 'accessories':
            return productCategory === 'accessories' || 
                   productCategory === 'accessory';
          default:
            return false;
        }
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    setFilteredProducts(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [products, selectedCategory, sortBy, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleAddToCart = (productData) => {
    addToCart(productData);
    showToast('Product added to cart!');
  };

  const handleToggleFavorite = async (productId) => {
    if (!isAuthenticated) {
      showToast('Please login to manage favorites', 'error');
      return;
    }
    
    try {
      await toggleFavorite(productId);
      
      const isCurrentlyFavorite = favoriteIds.includes(productId);
      
      setFavoriteIds(prev => {
        if (prev.includes(productId)) {
          return prev.filter(id => id !== productId);
        } else {
          return [...prev, productId];
        }
      });
      
      // Move toast calls outside setState to prevent render warning
      if (isCurrentlyFavorite) {
        showToast('Removed from favorites', 'success');
      } else {
        showToast('Added to favorites', 'success');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast('Error updating favorites. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border spinner-border-custom text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted fs-5">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="display-1 mb-3">😞</div>
          <h2 className="h3 mb-3 text-muted">Oops! Something went wrong</h2>
          <p className="text-muted mb-4">{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-5">
        <div className="container">
          <div className="text-center">
            <h1 className="display-3 fw-bold mb-4">
              <span className="text-warning">Premium</span>
              <span className="d-block text-white">Collection</span>
            </h1>
            <p className="fs-4 mb-0 text-light">
              Discover fashion that defines your unique style
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-4 bg-white shadow-sm sticky-top" style={{zIndex: 10}}>
        <div className="container">
          <div className="row align-items-center g-3">
            <div className="col-md-4">
              <input
                type="search"
                className="form-control border-2"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{borderRadius: '50px'}}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select border-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{borderRadius: '50px'}}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select border-2"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{borderRadius: '50px'}}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <div className="text-muted text-center">
                <small>
                  {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-5">
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <div className="display-1 mb-4">🔍</div>
              <h3 className="h4 mb-3 text-muted">No products found</h3>
              <p className="text-muted mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button 
                className="btn btn-outline-primary"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                  setSortBy('name');
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="row g-4">
                {currentProducts.map((product) => (
                  <div key={product._id} className="col-lg-3 col-md-4 col-sm-6">
                    <ProductCard 
                      product={product}
                      onAddToCart={handleAddToCart}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={favoriteIds.includes(product._id)}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredProducts.length}
                />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products; 