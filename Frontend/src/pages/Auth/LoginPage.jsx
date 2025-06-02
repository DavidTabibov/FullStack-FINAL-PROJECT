import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error message when typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await login(formData);
            
            if (result) {
                toast.success('Welcome back! Login successful.');
                navigate('/');
            }
        } catch (err) {
            console.error('Login error:', err);

            let errorMessage = '';
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.status === 404) {
                errorMessage = 'User does not exist. Please register first.';
            } else if (err.response?.status === 401) {
                errorMessage = 'Invalid email or password. Please try again.';
            } else if (err.response?.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            } else if (err.request) {
                errorMessage = 'Unable to connect to server. Please check your connection.';
            } else {
                errorMessage = 'An unexpected error occurred. Please try again.';
            }

            setError(errorMessage);
            toast.error(errorMessage);
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
                            <div className="hero-gradient p-4 p-lg-5 text-center text-white">
                                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" 
                                     style={{width: '80px', height: '80px', backgroundColor: 'rgba(255,255,255,0.2)'}}>
                                    <FaSignInAlt size={40} />
                                </div>
                                <h2 className="h3 mb-2 fw-bold">Welcome Back</h2>
                                <p className="mb-0 opacity-90">Sign in to access your fashion collection</p>
                            </div>

                            <div className="p-4 p-lg-5">
                                {error && (
                                    <div className="alert alert-danger border-0 rounded-3 mb-4" role="alert">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="form-label fw-medium text-dark mb-2">
                                            <i className="bi bi-envelope me-2 text-primary"></i>
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg border-2 rounded-3 px-4 py-3"
                                            style={{backgroundColor: '#f8f9fa', transition: 'all 0.3s ease'}}
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={isLoading}
                                            placeholder="Enter your email address"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label fw-medium text-dark mb-2">
                                            <i className="bi bi-lock me-2 text-primary"></i>
                                            Password
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control form-control-lg border-2 rounded-3 px-4 py-3 pe-5"
                                                style={{backgroundColor: '#f8f9fa', transition: 'all 0.3s ease'}}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                disabled={isLoading}
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent text-muted"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{zIndex: 10}}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="d-grid mb-4">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary btn-lg fw-medium rounded-3 py-3"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Signing In...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                                    Sign In
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="text-center mb-4">
                                        <Link 
                                            to="/forgot-password" 
                                            className="text-decoration-none fw-medium text-primary"
                                        >
                                            <i className="bi bi-question-circle me-1"></i>
                                            Forgot your password?
                                        </Link>
                                    </div>

                                    <hr className="my-4" />

                                    <div className="text-center">
                                        <p className="mb-0 text-muted">
                                            Don't have an account yet?{' '}
                                            <Link 
                                                to="/register" 
                                                className="text-decoration-none fw-medium text-primary"
                                            >
                                                Sign up now
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
}

export default LoginPage;