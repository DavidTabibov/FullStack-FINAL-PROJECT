import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import axios from 'axios';

const AdminUsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user'
  });
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (userToEdit) => {
    setSelectedUser(userToEdit);
    setEditFormData({
      firstName: userToEdit.firstName || '',
      lastName: userToEdit.lastName || '',
      email: userToEdit.email || '',
      role: userToEdit.role || 'user'
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (userToDelete) => {
    setSelectedUser(userToDelete);
    setShowDeleteModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updatedUser = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        role: editFormData.role
      };

      await axios.put(`/api/users/${selectedUser._id}`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowEditModal(false);
      fetchUsers(); // Refresh users list
      showToast('User updated successfully', 'success');
    } catch (error) {
      console.error('Error updating user:', error);
      showToast('Error updating user. Please try again.', 'error');
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowDeleteModal(false);
      fetchUsers(); // Refresh users list
      showToast('User deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Error deleting user. Please try again.', 'error');
    }
  };

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
      <h1 className="display-6 fw-bold text-dark mb-4">
        <i className="bi bi-people-fill text-primary me-2"></i>
        User Management
      </h1>

      {/* Users Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="card-title mb-0">
            <i className="bi bi-table me-2"></i>
            System Users List
          </h3>
        </div>
        <div className="card-body">
          {users.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people display-1 text-muted mb-3"></i>
              <h4 className="text-muted">No users in the system</h4>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem, index) => (
                    <tr key={userItem._id}>
                      <td className="fw-bold">{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                            {userItem.firstName?.charAt(0) || userItem.email.charAt(0)}
                          </div>
                          {userItem.firstName && userItem.lastName ? 
                            `${userItem.firstName} ${userItem.lastName}` : 
                            'Not Set'
                          }
                        </div>
                      </td>
                      <td className="text-muted">{userItem.email}</td>
                      <td>
                        {userItem.role === 'admin' ? (
                          <span className="badge bg-danger fs-6">
                            <i className="bi bi-shield-fill me-1"></i>
                            Admin
                          </span>
                        ) : (
                          <span className="badge bg-secondary fs-6">
                            <i className="bi bi-person-fill me-1"></i>
                            User
                          </span>
                        )}
                      </td>
                      <td className="text-muted">
                        {new Date(userItem.createdAt).toLocaleDateString('en-US')}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => handleEditClick(userItem)}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Edit
                        </button>
                        {userItem._id !== user?._id && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteClick(userItem)}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={editFormData.firstName}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={editFormData.lastName}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      name="role"
                      value={editFormData.role}
                      onChange={handleEditFormChange}
                    >
                      <option value="user">Regular User</option>
                      <option value="admin">System Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
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
                <p>Are you sure you want to delete the user:</p>
                <strong>{selectedUser?.firstName} {selectedUser?.lastName} ({selectedUser?.email})</strong>
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
                  onClick={handleDeleteSubmit}
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card border-primary">
            <div className="card-body text-center">
              <i className="bi bi-people-fill text-primary display-4 mb-2"></i>
              <h5 className="card-title">Total Users</h5>
              <h3 className="text-primary">{users.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-danger">
            <div className="card-body text-center">
              <i className="bi bi-shield-fill text-danger display-4 mb-2"></i>
              <h5 className="card-title">System Admins</h5>
              <h3 className="text-danger">{users.filter(u => u.role === 'admin').length}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersManagement; 