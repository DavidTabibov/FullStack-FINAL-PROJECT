import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import useChangePassword from '../../hooks/useChangePassword';
import { useToast } from '../../context/ToastContext';

const ProfilePage = () => {
    const { user, loading: authLoading } = useAuth();
    const { updateProfile, loading: profileLoading, error: profileError } = useProfile();
    const { changePassword } = useChangePassword();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const loading = authLoading || profileLoading;

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || user.name?.first || '',
                lastName: user.lastName || user.name?.last || '',
                email: user.email || ''
            });
        }
    }, [user]);

    // Clear local error when profile error changes
    useEffect(() => {
        if (profileError) {
            setError(profileError);
        }
    }, [profileError]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const success = await updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName
            });
            
            if (success) {
                setSuccess('Profile updated successfully!');
            }
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('🔒 Password confirmation does not match. Please ensure both passwords are identical.', 'error');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            showToast('🔐 Password must be at least 6 characters long for security', 'error');
            return;
        }
        
        setIsChangingPassword(true);
        
        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            showToast('🔑 Password updated successfully! Your account is now more secure.', 'success');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            showToast(`❌ ${error.message || 'Failed to change password. Please verify your current password and try again.'}`, 'error');
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (!user) {
        return (
            <div className="container py-5 text-center">
                <h2 className="h3 fw-bold mb-4">Please log in to view your profile</h2>
                <button 
                    onClick={() => window.location.href = '/login'}
                    className="btn btn-primary"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        {/* Main Card */}
                        <div className="card border-0 shadow-lg" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                            
                            {/* Header Section */}
                            <div className="text-center" style={{ 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                padding: '2.5rem 2rem'
                            }}>
                                <div className="mb-3">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-20" 
                                         style={{ width: '70px', height: '70px' }}>
                                        <i className="bi bi-person-gear text-white" style={{ fontSize: '2rem' }}></i>
                                    </div>
                                </div>
                                <h1 className="h3 fw-bold text-white mb-2">Profile Settings</h1>
                                <p className="text-white-50 mb-0">Manage your account information</p>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="bg-white p-3">
                                <div className="row g-2">
                                    <div className="col-6">
                                        <button
                                            className={`btn w-100 py-2 px-3 fw-semibold ${
                                                activeTab === 'profile' 
                                                    ? 'btn-primary shadow-sm' 
                                                    : 'btn-outline-primary'
                                            }`}
                                            onClick={() => setActiveTab('profile')}
                                            style={{ borderRadius: '12px', transition: 'all 0.3s ease' }}
                                        >
                                            <i className="bi bi-person-circle me-2"></i>
                                            <span className="d-none d-sm-inline">Profile</span>
                                            <span className="d-sm-none">Info</span>
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            className={`btn w-100 py-2 px-3 fw-semibold ${
                                                activeTab === 'password' 
                                                    ? 'btn-warning shadow-sm text-white' 
                                                    : 'btn-outline-warning'
                                            }`}
                                            onClick={() => setActiveTab('password')}
                                            style={{ borderRadius: '12px', transition: 'all 0.3s ease' }}
                                        >
                                            <i className="bi bi-shield-lock me-2"></i>
                                            <span className="d-none d-sm-inline">Security</span>
                                            <span className="d-sm-none">Pass</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="card-body p-4" style={{ minHeight: '500px' }}>
                                
                                {/* Alert Messages */}
                                {error && (
                                    <div className="alert alert-danger d-flex align-items-center mb-4 border-0 shadow-sm" 
                                         style={{ borderRadius: '16px' }} role="alert">
                                        <i className="bi bi-exclamation-triangle-fill me-3 fs-5"></i>
                                        <div>
                                            <strong>Error!</strong> {error}
                                        </div>
                                    </div>
                                )}
                                
                                {success && (
                                    <div className="alert alert-success d-flex align-items-center mb-4 border-0 shadow-sm" 
                                         style={{ borderRadius: '16px' }} role="alert">
                                        <i className="bi bi-check-circle-fill me-3 fs-5"></i>
                                        <div>
                                            <strong>Success!</strong> {success}
                                        </div>
                                    </div>
                                )}

                                {/* Profile Information Tab */}
                                {activeTab === 'profile' && (
                                    <div>
                                        {/* Header */}
                                        <div className="text-center mb-4">
                                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                                 style={{ 
                                                     width: '80px', 
                                                     height: '80px',
                                                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                 }}>
                                                <i className="bi bi-person-fill text-white" style={{ fontSize: '2.5rem' }}></i>
                                            </div>
                                            <h2 className="h4 fw-bold mb-2 text-dark">Personal Information</h2>
                                            <p className="text-muted mb-0 small">Update your personal details</p>
                                        </div>

                                        <form onSubmit={handleProfileSubmit}>
                                            <div className="mb-4">
                                                <div className="text-center mb-3">
                                                    <label htmlFor="firstName" className="form-label fw-bold text-dark d-block">
                                                        <i className="bi bi-person-circle me-2 text-primary"></i>
                                                        First Name
                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    className="form-control form-control-lg border-0 shadow-sm text-center"
                                                    required
                                                    placeholder="Enter your first name"
                                                    style={{ 
                                                        borderRadius: '16px',
                                                        padding: '1rem',
                                                        fontSize: '1rem',
                                                        backgroundColor: '#f8f9fa'
                                                    }}
                                                />
                                            </div>
                                            
                                            <div className="mb-4">
                                                <div className="text-center mb-3">
                                                    <label htmlFor="lastName" className="form-label fw-bold text-dark d-block">
                                                        <i className="bi bi-person-badge-fill me-2 text-primary"></i>
                                                        Last Name
                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    className="form-control form-control-lg border-0 shadow-sm text-center"
                                                    required
                                                    placeholder="Enter your last name"
                                                    style={{ 
                                                        borderRadius: '16px',
                                                        padding: '1rem',
                                                        fontSize: '1rem',
                                                        backgroundColor: '#f8f9fa'
                                                    }}
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <div className="text-center mb-3">
                                                    <label htmlFor="email" className="form-label fw-bold text-dark d-block">
                                                        <i className="bi bi-envelope-fill me-2 text-primary"></i>
                                                        Email Address
                                                    </label>
                                                </div>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={formData.email}
                                                    className="form-control form-control-lg border-0 shadow-sm text-center"
                                                    disabled
                                                    style={{ 
                                                        borderRadius: '16px',
                                                        padding: '1rem',
                                                        fontSize: '1rem',
                                                        backgroundColor: '#e9ecef',
                                                        opacity: '0.8'
                                                    }}
                                                />
                                                <div className="text-center mt-2">
                                                    <small className="text-muted">
                                                        <i className="bi bi-shield-check me-1 text-success"></i>
                                                        Email is secured and cannot be modified
                                                    </small>
                                                </div>
                                            </div>

                                            <hr className="my-4" style={{ opacity: '0.2' }} />

                                            <div className="row g-2">
                                                <div className="col-6">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary w-100 fw-semibold"
                                                        onClick={() => {
                                                            if (user) {
                                                                setFormData({
                                                                    firstName: user.firstName || '',
                                                                    lastName: user.lastName || '',
                                                                    email: user.email || ''
                                                                });
                                                            }
                                                        }}
                                                        style={{ 
                                                            borderRadius: '12px',
                                                            padding: '0.75rem'
                                                        }}
                                                    >
                                                        <i className="bi bi-arrow-counterclockwise me-1"></i>
                                                        Reset
                                                    </button>
                                                </div>
                                                <div className="col-6">
                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="btn btn-primary w-100 fw-semibold shadow-sm"
                                                        style={{ 
                                                            borderRadius: '12px',
                                                            padding: '0.75rem'
                                                        }}
                                                    >
                                                        <i className="bi bi-check-circle-fill me-1"></i>
                                                        {loading ? 'Saving...' : 'Save'}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Change Password Tab */}
                                {activeTab === 'password' && (
                                    <div>
                                        {/* Header */}
                                        <div className="text-center mb-4">
                                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                                                 style={{ 
                                                     width: '80px', 
                                                     height: '80px',
                                                     background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                                                 }}>
                                                <i className="bi bi-shield-lock-fill text-white" style={{ fontSize: '2.5rem' }}></i>
                                            </div>
                                            <h2 className="h4 fw-bold mb-2 text-dark">Security Settings</h2>
                                            <p className="text-muted mb-0 small">Update your password to keep secure</p>
                                        </div>

                                        <form onSubmit={handlePasswordSubmit}>
                                            <div className="mb-4">
                                                <div className="text-center mb-3">
                                                    <label htmlFor="currentPassword" className="form-label fw-bold text-dark d-block">
                                                        <i className="bi bi-lock-fill me-2 text-danger"></i>
                                                        Current Password
                                                    </label>
                                                </div>
                                                <input
                                                    type="password"
                                                    id="currentPassword"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    className="form-control form-control-lg border-0 shadow-sm text-center"
                                                    required
                                                    placeholder="Enter current password"
                                                    style={{ 
                                                        borderRadius: '16px',
                                                        padding: '1rem',
                                                        fontSize: '1rem',
                                                        backgroundColor: '#f8f9fa'
                                                    }}
                                                />
                                            </div>

                                            <div className="mb-4">
                                                <div className="text-center mb-3">
                                                    <label htmlFor="newPassword" className="form-label fw-bold text-dark d-block">
                                                        <i className="bi bi-key-fill me-2 text-success"></i>
                                                        New Password
                                                    </label>
                                                </div>
                                                <input
                                                    type="password"
                                                    id="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="form-control form-control-lg border-0 shadow-sm text-center"
                                                    required
                                                    minLength={6}
                                                    placeholder="Enter new password"
                                                    style={{ 
                                                        borderRadius: '16px',
                                                        padding: '1rem',
                                                        fontSize: '1rem',
                                                        backgroundColor: '#f8f9fa'
                                                    }}
                                                />
                                                <div className="text-center mt-2">
                                                    <small className="text-muted">
                                                        <i className="bi bi-info-circle-fill me-1 text-info"></i>
                                                        Minimum 6 characters required
                                                    </small>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <div className="text-center mb-3">
                                                    <label htmlFor="confirmPassword" className="form-label fw-bold text-dark d-block">
                                                        <i className="bi bi-check-circle-fill me-2 text-primary"></i>
                                                        Confirm Password
                                                    </label>
                                                </div>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="form-control form-control-lg border-0 shadow-sm text-center"
                                                    required
                                                    minLength={6}
                                                    placeholder="Confirm new password"
                                                    style={{ 
                                                        borderRadius: '16px',
                                                        padding: '1rem',
                                                        fontSize: '1rem',
                                                        backgroundColor: '#f8f9fa'
                                                    }}
                                                />
                                            </div>

                                            <div className="alert alert-info border-0 shadow-sm text-center mb-4" 
                                                 role="alert" style={{ borderRadius: '12px', backgroundColor: '#e3f2fd' }}>
                                                <i className="bi bi-lightbulb-fill me-2 text-info"></i>
                                                <small><strong>Tip:</strong> Use letters, numbers, and symbols</small>
                                            </div>

                                            <hr className="my-4" style={{ opacity: '0.2' }} />

                                            <div className="row g-2">
                                                <div className="col-6">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary w-100 fw-semibold"
                                                        onClick={() => setPasswordData({
                                                            currentPassword: '',
                                                            newPassword: '',
                                                            confirmPassword: ''
                                                        })}
                                                        style={{ 
                                                            borderRadius: '12px',
                                                            padding: '0.75rem'
                                                        }}
                                                    >
                                                        <i className="bi bi-arrow-counterclockwise me-1"></i>
                                                        Clear
                                                    </button>
                                                </div>
                                                <div className="col-6">
                                                    <button
                                                        type="submit"
                                                        disabled={loading || isChangingPassword}
                                                        className="btn btn-warning w-100 text-white fw-semibold shadow-sm"
                                                        style={{ 
                                                            borderRadius: '12px',
                                                            padding: '0.75rem'
                                                        }}
                                                    >
                                                        <i className="bi bi-shield-check me-1"></i>
                                                        {loading ? 'Updating...' : isChangingPassword ? 'Updating...' : 'Update'}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
