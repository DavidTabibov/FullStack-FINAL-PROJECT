import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const toast = useToast();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) errors.push('At least 8 characters');
        if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
        if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
        if (!/\d{4,}/.test(password)) errors.push('At least 4 digits');
        if (!/[!@#$%^&*\-_]/.test(password)) errors.push('One special character (!@#$%^&*-_)');
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Real-time validation
        const newErrors = { ...errors };
        
        if (name === 'password') {
            const passwordErrors = validatePassword(value);
            if (passwordErrors.length > 0) {
                newErrors.password = passwordErrors;
            } else {
                delete newErrors.password;
            }
        }

        if (name === 'confirmPassword' || (name === 'password' && formData.confirmPassword)) {
            const passwordToCheck = name === 'password' ? value : formData.password;
            const confirmPasswordToCheck = name === 'confirmPassword' ? value : formData.confirmPassword;
            
            if (confirmPasswordToCheck && passwordToCheck !== confirmPasswordToCheck) {
                newErrors.confirmPassword = ['Passwords do not match'];
            } else {
                delete newErrors.confirmPassword;
            }
        }

        setErrors(newErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            // Validate passwords match
            if (formData.password !== formData.confirmPassword) {
                setErrors({ confirmPassword: ['Passwords do not match'] });
                setIsLoading(false);
                return;
            }

            // Validate password strength
            const passwordErrors = validatePassword(formData.password);
            if (passwordErrors.length > 0) {
                setErrors({ password: passwordErrors });
                setIsLoading(false);
                return;
            }

            toast.info('Creating your account...');

            // Use the auth service instead of direct axios call
            const result = await register({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            if (result.success) {
                toast.success('Account created successfully! Welcome to Luxe Boutique!');
                // Redirect immediately after successful registration
                navigate('/');
            } else {
                const errorMessage = result.error || 'Registration failed';
                
                if (errorMessage.includes('email') && errorMessage.includes('already')) {
                    setErrors({ email: ['This email is already registered'] });
                    toast.error('An account with this email already exists.');
                } else if (errorMessage.includes('password')) {
                    setErrors({ password: [errorMessage] });
                    toast.error('Password requirements not met.');
                } else if (errorMessage.includes('email') && errorMessage.includes('invalid')) {
                    setErrors({ email: ['Please enter a valid email address'] });
                    toast.error('Please enter a valid email address.');
                } else {
                    setErrors({ general: errorMessage });
                    toast.error(errorMessage);
                }
            }

        } catch (error) {
            console.error('Registration error:', error);
            
            const errorMessage = error.message || 'Registration failed';
            
            if (errorMessage.includes('email') && errorMessage.includes('already')) {
                setErrors({ email: ['This email is already registered'] });
                toast.error('An account with this email already exists.');
            } else if (errorMessage.includes('password')) {
                setErrors({ password: [errorMessage] });
                toast.error('Password requirements not met.');
            } else if (errorMessage.includes('email') && errorMessage.includes('invalid')) {
                setErrors({ email: ['Please enter a valid email address'] });
                toast.error('Please enter a valid email address.');
            } else {
                setErrors({ general: errorMessage });
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card border-0 shadow-lg">
                            {/* Header Section */}
                            <div className="hero-gradient p-4 p-lg-5 text-center text-white">
                                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                                     style={{width: '80px', height: '80px', backgroundColor: 'rgba(255,255,255,0.2)'}}>
                                    <FaUserPlus size={40} />
                                </div>
                                <h2 className="h3 mb-2 fw-bold">Join Luxe Boutique</h2>
                                <p className="mb-0 opacity-90">Create your account to start shopping</p>
                            </div>

                            {/* Form Section */}
                            <div className="p-4 p-lg-5">
                                {errors.general && (
                                    <div className="alert alert-danger" role="alert">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        {errors.general}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    {/* Name Fields */}
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="firstName" className="form-label fw-medium">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                disabled={isLoading}
                                                placeholder="Enter your first name"
                                            />
                                            {errors.firstName && (
                                                <div className="invalid-feedback">
                                                    {errors.firstName[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="lastName" className="form-label fw-medium">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                disabled={isLoading}
                                                placeholder="Enter your last name"
                                            />
                                            {errors.lastName && (
                                                <div className="invalid-feedback">
                                                    {errors.lastName[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label fw-medium">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={isLoading}
                                            placeholder="Enter your email address"
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                {errors.email[0]}
                                            </div>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label fw-medium">
                                            Password
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                disabled={isLoading}
                                                placeholder="Create a strong password"
                                            />
                                            <button
                                                type="button"
                                                className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent text-muted"
                                                onClick={() => setShowPassword(!showPassword)}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <div className="text-danger mt-2 small">
                                                <div className="fw-semibold mb-1">Password must include:</div>
                                                <ul className="mb-0 ps-3">
                                                    {errors.password.map((error, index) => (
                                                        <li key={index}>{error}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="form-label fw-medium">
                                            Confirm Password
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                                disabled={isLoading}
                                                placeholder="Confirm your password"
                                            />
                                            <button
                                                type="button"
                                                className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent text-muted"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <div className="invalid-feedback d-block">
                                                {errors.confirmPassword[0]}
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-grid mb-4">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary btn-lg"
                                            disabled={isLoading || Object.keys(errors).filter(key => key !== 'general').length > 0}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Creating Account...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-person-plus me-2"></i>
                                                    Create Account
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-muted mb-0">
                                            Already have an account?{' '}
                                            <Link to="/login" className="text-primary text-decoration-none fw-medium">
                                                Sign in here
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage; 