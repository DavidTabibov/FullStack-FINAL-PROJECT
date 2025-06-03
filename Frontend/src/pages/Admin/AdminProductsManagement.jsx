import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const AdminProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: 'men',
    subcategory: '',
    price: '',
    salePrice: '',
    images: [''],
    sizes: [{ size: 'M', quantity: 0 }],
    colors: [{ name: 'Black', code: '#000000' }],
    countInStock: '',
    isFeatured: false,
    isNew: true,
    isSale: false
  });
  const { user } = useAuth();
  const { showToast } = useToast();

  const categories = [
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
    { value: 'kids', label: 'Kids' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products?limit=1000');
      setProducts(response.data.products || response.data || []);
    } catch (error) {
      setError('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    const updated = {
      ...formData,
      [name]: newValue
    };
    
    setFormData(updated);
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = { ...newSizes[index], [field]: value };
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  const addSizeField = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: 'M', quantity: 0 }]
    }));
  };

  const removeSizeField = (index) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...formData.colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setFormData(prev => ({ ...prev, colors: newColors }));
  };

  const addColorField = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: '', code: '#000000' }]
    }));
  };

  const removeColorField = (index) => {
    const newColors = formData.colors.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, colors: newColors }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      brand: '',
      category: 'men',
      subcategory: '',
      price: '',
      salePrice: '',
      images: [''],
      sizes: [{ size: 'M', quantity: 0 }],
      colors: [{ name: 'Black', code: '#000000' }],
      countInStock: '',
      isFeatured: false,
      isNew: true,
      isSale: false
    });
  };

  const handleAddProduct = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    
    // Ensure proper boolean conversion for checkboxes
    const formState = {
      name: product.name || '',
      description: product.description || '',
      brand: product.brand || '',
      category: product.category || 'men',
      subcategory: product.subcategory || '',
      price: product.price || '',
      salePrice: product.salePrice || '',
      images: product.images && product.images.length > 0 ? product.images : [''],
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [{ size: 'M', quantity: 0 }],
      colors: product.colors && product.colors.length > 0 ? product.colors : [{ name: 'Black', code: '#000000' }],
      countInStock: product.countInStock || '',
      isFeatured: Boolean(product.isFeatured),
      isNew: Boolean(product.isNew),
      isSale: Boolean(product.isSale)
    };
    
    setFormData(formState);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : 0,
        countInStock: parseInt(formData.countInStock),
        images: formData.images.filter(img => img.trim() !== ''),
        sizes: formData.sizes.filter(size => size.size && size.quantity >= 0),
        colors: formData.colors.filter(color => color.name && color.code)
      };

      if (selectedProduct) {
        // Update existing product
        await axios.put(`/api/products/${selectedProduct._id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShowEditModal(false);
        showToast('✅ Product updated successfully! Changes have been saved.', 'success');
      } else {
        // Create new product
        await axios.post('/api/products', productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShowAddModal(false);
        showToast('🎉 New product created successfully! It\'s now available in your store.', 'success');
      }
      
      fetchProducts();
      resetForm();
      setSelectedProduct(null);
    } catch (error) {
      showToast('❌ Unable to save product. Please check all fields and try again.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/products/${selectedProduct._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowDeleteModal(false);
      fetchProducts();
      showToast(`🗑️ "${selectedProduct.name}" has been permanently deleted from your store.`, 'success');
    } catch (error) {
      showToast('❌ Unable to delete product. Please try again or contact support.', 'error');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-6 fw-bold text-dark">
          <i className="bi bi-box-fill text-primary me-2"></i>
          Product Management
        </h1>
        <button
          className="btn btn-primary"
          onClick={handleAddProduct}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="card-title mb-0">
            <i className="bi bi-table me-2"></i>
            Products List ({filteredProducts.length})
          </h3>
        </div>
        <div className="card-body">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-box display-1 text-muted mb-3"></i>
              <h4 className="text-muted">No products found</h4>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr key={product._id}>
                      <td className="fw-bold">{index + 1}</td>
                      <td>
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="rounded"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="bg-light d-flex align-items-center justify-content-center rounded" style={{ width: '50px', height: '50px' }}>
                            <i className="bi bi-image text-muted"></i>
                          </div>
                        )}
                      </td>
                      <td className="fw-semibold">{product.name}</td>
                      <td>{product.brand}</td>
                      <td>
                        <span className="badge bg-secondary text-capitalize">{product.category}</span>
                      </td>
                      <td>
                        <div>
                          <span className="fw-bold text-success">₪{product.price}</span>
                          {product.salePrice > 0 && (
                            <div>
                              <span className="text-decoration-line-through text-muted small">₪{product.salePrice}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${product.countInStock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.countInStock}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {product.isFeatured && <span className="badge bg-warning">Featured</span>}
                          {product.isNew && <span className="badge bg-info">New</span>}
                          {product.isSale && <span className="badge bg-danger">Sale</span>}
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm me-1 mb-1"
                          onClick={() => handleEditProduct(product)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm mb-1"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || showEditModal) && (
        <div 
          className="modal show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
          key={selectedProduct ? `edit-${selectedProduct._id}` : 'add-new'}
        >
          <div className="modal-dialog modal-lg" style={{ maxHeight: '90vh', margin: '2rem auto' }}>
            <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header" style={{ flexShrink: 0 }}>
                <h5 className="modal-title">
                  {selectedProduct ? 'Edit Product' : 'Add New Product'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                    setSelectedProduct(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="modal-body" style={{ flexGrow: 1, overflowY: 'auto', maxHeight: 'calc(90vh - 140px)' }}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Brand *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        className="form-select"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Subcategory *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Stock Count *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="countInStock"
                        value={formData.countInStock}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Price (₪) *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Sale Price (₪)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Images */}
                  <div className="mb-3">
                    <label className="form-label">Product Images *</label>
                    {formData.images.map((image, index) => (
                      <div key={index} className="input-group mb-2">
                        <input
                          type="url"
                          className="form-control"
                          placeholder="Image URL"
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          required={index === 0}
                        />
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => removeImageField(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={addImageField}
                    >
                      <i className="bi bi-plus me-1"></i>Add Image
                    </button>
                  </div>

                  {/* Sizes */}
                  <div className="mb-3">
                    <label className="form-label">Available Sizes</label>
                    {formData.sizes.map((size, index) => (
                      <div key={index} className="row mb-2">
                        <div className="col-6">
                          <select
                            className="form-select"
                            value={size.size}
                            onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                          >
                            {sizes.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-4">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Quantity"
                            value={size.quantity}
                            onChange={(e) => handleSizeChange(index, 'quantity', parseInt(e.target.value) || 0)}
                            min="0"
                          />
                        </div>
                        <div className="col-2">
                          {formData.sizes.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => removeSizeField(index)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={addSizeField}
                    >
                      <i className="bi bi-plus me-1"></i>Add Size
                    </button>
                  </div>

                  {/* Colors */}
                  <div className="mb-3">
                    <label className="form-label">Available Colors</label>
                    {formData.colors.map((color, index) => (
                      <div key={index} className="row mb-2">
                        <div className="col-6">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Color name"
                            value={color.name}
                            onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="col-4">
                          <input
                            type="color"
                            className="form-control form-control-color"
                            value={color.code}
                            onChange={(e) => handleColorChange(index, 'code', e.target.value)}
                          />
                        </div>
                        <div className="col-2">
                          {formData.colors.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => removeColorField(index)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={addColorField}
                    >
                      <i className="bi bi-plus me-1"></i>Add Color
                    </button>
                  </div>

                  {/* Status Checkboxes */}
                  <div className="row mb-4">
                    <div className="col-12 mb-2">
                      <label className="form-label fw-bold">Product Status</label>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isFeatured"
                          checked={Boolean(formData.isFeatured)}
                          onChange={handleInputChange}
                        />
                        <label 
                          className="form-check-label" 
                          htmlFor="isFeatured"
                        >
                          Featured Product
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isNew"
                          checked={Boolean(formData.isNew)}
                          onChange={handleInputChange}
                        />
                        <label 
                          className="form-check-label" 
                          htmlFor="isNew"
                        >
                          New Product
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isSale"
                          checked={Boolean(formData.isSale)}
                          onChange={handleInputChange}
                        />
                        <label 
                          className="form-check-label" 
                          htmlFor="isSale"
                        >
                          On Sale
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer" style={{ flexShrink: 0, borderTop: '1px solid #dee2e6' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      resetForm();
                      setSelectedProduct(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {selectedProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the product:</p>
                <strong>{selectedProduct?.name}</strong>
                <p className="text-danger mt-2">This action cannot be undone!</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card border-primary">
            <div className="card-body text-center">
              <i className="bi bi-box-fill text-primary display-4 mb-2"></i>
              <h5 className="card-title">Total Products</h5>
              <h3 className="text-primary">{products.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success">
            <div className="card-body text-center">
              <i className="bi bi-check-circle-fill text-success display-4 mb-2"></i>
              <h5 className="card-title">In Stock</h5>
              <h3 className="text-success">{products.filter(p => p.countInStock > 0).length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning">
            <div className="card-body text-center">
              <i className="bi bi-star-fill text-warning display-4 mb-2"></i>
              <h5 className="card-title">Featured</h5>
              <h3 className="text-warning">{products.filter(p => p.isFeatured).length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-danger">
            <div className="card-body text-center">
              <i className="bi bi-exclamation-triangle-fill text-danger display-4 mb-2"></i>
              <h5 className="card-title">Out of Stock</h5>
              <h3 className="text-danger">{products.filter(p => p.countInStock === 0).length}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsManagement; 