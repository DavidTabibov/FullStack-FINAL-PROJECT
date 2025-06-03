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
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        {/* Header */}
                        <div className="card-header bg-primary text-white">
                            <h1 className="h3 fw-bold mb-1">Profile Settings</h1>
                            <p className="mb-0 opacity-75">Manage your account information</p>
                        </div>

                        {/* Tabs */}
                        <div className="card-body p-0">
                            <ul className="nav nav-tabs" id="profileTabs" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                        id="profile-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#profile"
                                        type="button"
                                        role="tab"
                                        aria-controls="profile"
                                        aria-selected={activeTab === 'profile'}
                                        onClick={() => setActiveTab('profile')}
                                    >
                                        Profile Information
                                    </button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button
                                        className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                                        id="password-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#password"
                                        type="button"
                                        role="tab"
                                        aria-controls="password"
                                        aria-selected={activeTab === 'password'}
                                        onClick={() => setActiveTab('password')}
                                    >
                                        Change Password
                                    </button>
                                </li>
                            </ul>

                            {/* Content */}
                            <div className="p-4">
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                
                                {success && (
                                    <div className="alert alert-success" role="alert">
                                        {success}
                                    </div>
                                )}

                                <div className="tab-content" id="profileTabsContent">
                                    {activeTab === 'profile' && (
                                        <div className="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                            <h2 className="h5 fw-semibold mb-4">Personal Information</h2>
                                            <form onSubmit={handleProfileSubmit}>
                                                <div className="row g-3 mb-3">
                                                    <div className="col-md-6">
                                                        <label htmlFor="firstName" className="form-label fw-medium">
                                                            First Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="firstName"
                                                            value={formData.firstName}
                                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="col-md-6">
                                                        <label htmlFor="lastName" className="form-label fw-medium">
                                                            Last Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="lastName"
                                                            value={formData.lastName}
                                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                            className="form-control"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="email" className="form-label fw-medium">
                                                        Email Address
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        value={formData.email}
                                                        className="form-control"
                                                        disabled
                                                    />
                                                    <div className="form-text">
                                                        Email address cannot be changed
                                                    </div>
                                                </div>

                                                <div className="d-flex justify-content-end">
                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="btn btn-primary"
                                                    >
                                                        {loading ? 'Saving...' : 'Save Changes'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {activeTab === 'password' && (
                                        <div className="tab-pane fade show active" id="password" role="tabpanel" aria-labelledby="password-tab">
                                            <h2 className="h5 fw-semibold mb-4">Change Password</h2>
                                            <form onSubmit={handlePasswordSubmit}>
                                                <div className="row justify-content-start">
                                                    <div className="col-md-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="currentPassword" className="form-label fw-medium">
                                                                Current Password
                                                            </label>
                                                            <input
                                                                type="password"
                                                                id="currentPassword"
                                                                value={passwordData.currentPassword}
                                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                                className="form-control"
                                                                required
                                                            />
                                                        </div>

                                                        <div className="mb-3">
                                                            <label htmlFor="newPassword" className="form-label fw-medium">
                                                                New Password
                                                            </label>
                                                            <input
                                                                type="password"
                                                                id="newPassword"
                                                                value={passwordData.newPassword}
                                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                                className="form-control"
                                                                required
                                                                minLength={6}
                                                            />
                                                        </div>

                                                        <div className="mb-4">
                                                            <label htmlFor="confirmPassword" className="form-label fw-medium">
                                                                Confirm New Password
                                                            </label>
                                                            <input
                                                                type="password"
                                                                id="confirmPassword"
                                                                value={passwordData.confirmPassword}
                                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                                className="form-control"
                                                                required
                                                                minLength={6}
                                                            />
                                                        </div>

                                                        <div className="d-flex justify-content-end">
                                                            <button
                                                                type="submit"
                                                                disabled={loading || isChangingPassword}
                                                                className="btn btn-primary"
                                                            >
                                                                {loading ? 'Updating...' : isChangingPassword ? 'Updating...' : 'Update Password'}
                                                            </button>
                                                        </div>
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
        </div>
    );
};

export default ProfilePage;
