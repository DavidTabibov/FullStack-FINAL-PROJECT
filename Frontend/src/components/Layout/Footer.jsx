import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isNewsletterLoading, setIsNewsletterLoading] = useState(false);

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        setIsNewsletterLoading(true);
        
        // Simulate newsletter signup
        setTimeout(() => {
            setIsNewsletterLoading(false);
            setEmail('');
            alert('Thank you for subscribing to our newsletter!');
        }, 1500);
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="luxe-footer bg-dark text-white mt-auto">
            {/* Newsletter Section */}
            <div className="newsletter-section py-4" style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
            }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-8 text-center text-md-start mb-3 mb-md-0">
                            <h2 className="mb-1 fw-bold h5">Stay Updated with Our Latest Collections</h2>
                            <p className="mb-0 opacity-75">Get updates on new products, special offers and styling tips</p>
                        </div>
                        <div className="col-md-4">
                            <form onSubmit={handleNewsletterSubmit} className="d-flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control rounded-pill px-4 py-3"
                                    placeholder="Email address"
                                    required
                                    disabled={isNewsletterLoading}
                                    style={{
                                        height: '50px',
                                        fontSize: '14px',
                                        border: '2px solid rgba(255, 255, 255, 0.2)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        flex: 1
                                    }}
                                />
                                <button 
                                    type="submit" 
                                    className="btn btn-warning text-dark fw-semibold rounded-pill px-4 py-3"
                                    disabled={isNewsletterLoading}
                                    style={{
                                        minWidth: '120px',
                                        height: '50px',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        whiteSpace: 'nowrap',
                                        border: 'none',
                                        boxShadow: '0 4px 15px rgba(251, 191, 36, 0.3)'
                                    }}
                                >
                                    {isNewsletterLoading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        'Subscribe'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="py-5" style={{
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
            }}>
                <div className="container">
                    <div className="row g-4">
                        {/* Brand Section */}
                        <div className="col-lg-4 col-md-6">
                            <div className="mb-4">
                                <Link to="/" className="text-decoration-none d-flex align-items-center mb-3">
                                    <div className="fs-2 me-2">✨</div>
                                    <div>
                                        <span className="h4 fw-bold mb-0 text-warning">Luxe</span>
                                        <span className="h4 fw-bold mb-0 text-white ms-1">Boutique</span>
                                    </div>
                                </Link>
                                <p className="text-light mb-4" style={{lineHeight: '1.6'}}>
                                    Your destination for premium fashion and quality clothing. We bring you the hottest collections 
                                    from the world's best brands with personal and professional service.
                                </p>
                                
                                {/* Social Media */}
                                <div className="d-flex gap-3">
                                    <a 
                                        href="#" 
                                        className="social-link text-white text-decoration-none d-flex align-items-center justify-content-center rounded-circle"
                                        title="Facebook"
                                    >
                                        <i className="bi bi-facebook"></i>
                                    </a>
                                    <a 
                                        href="#" 
                                        className="social-link text-white text-decoration-none d-flex align-items-center justify-content-center rounded-circle"
                                        title="Instagram"
                                    >
                                        <i className="bi bi-instagram"></i>
                                    </a>
                                    <a 
                                        href="#" 
                                        className="social-link text-white text-decoration-none d-flex align-items-center justify-content-center rounded-circle"
                                        title="WhatsApp"
                                    >
                                        <i className="bi bi-whatsapp"></i>
                                    </a>
                                    <a 
                                        href="mailto:info@luxeboutique.com" 
                                        className="social-link text-white text-decoration-none d-flex align-items-center justify-content-center rounded-circle"
                                        title="Email"
                                    >
                                        <i className="bi bi-envelope"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="col-lg-2 col-md-6 col-sm-6">
                            <h3 className="fw-bold mb-3 text-warning" style={{fontSize: '1rem'}}>Quick Links</h3>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <Link to="/" className="footer-link text-light text-decoration-none">
                                        <i className="bi bi-chevron-right me-2 small"></i>Home
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/products" className="footer-link text-light text-decoration-none">
                                        <i className="bi bi-chevron-right me-2 small"></i>Products
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/about" className="footer-link text-light text-decoration-none">
                                        <i className="bi bi-chevron-right me-2 small"></i>About Us
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/contact" className="footer-link text-light text-decoration-none">
                                        <i className="bi bi-chevron-right me-2 small"></i>Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div className="col-lg-2 col-md-6 col-sm-6">
                            <h3 className="fw-bold mb-3 text-warning" style={{fontSize: '1rem'}}>Categories</h3>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <Link to="/products?category=women" className="footer-link text-light text-decoration-none">
                                        <i className="bi bi-chevron-right me-2 small"></i>Women's Fashion
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/products?category=men" className="footer-link text-light text-decoration-none">
                                        <i className="bi bi-chevron-right me-2 small"></i>Men's Fashion
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/products?category=kids" className="footer-link text-light text-decoration-none">
                                        <i className="bi bi-chevron-right me-2 small"></i>Kids Fashion
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/products?category=accessories" className="footer-link text-light text-decoration-none">
                                        <i className="bi bi-chevron-right me-2 small"></i>Accessories
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Customer Service */}
                        <div className="col-lg-2 col-md-6 col-sm-6">
                            <h3 className="fw-bold mb-3 text-warning" style={{fontSize: '1rem'}}>Customer Service</h3>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <a href="#" className="footer-link text-light text-decoration-none">
                                        <i className="bi bi-chevron-right me-2 small"></i>Return Policy
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="footer-link text-light text-decoration-none">
                                        <i className="bi bi-chevron-right me-2 small"></i>Shipping
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="footer-link text-light text-decoration-none">
                                        <i className="bi bi-chevron-right me-2 small"></i>Payment Methods
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="footer-link text-light text-decoration-none">
                                        <i className="bi bi-chevron-right me-2 small"></i>FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="col-lg-2 col-md-6 col-sm-6">
                            <h3 className="fw-bold mb-3 text-warning" style={{fontSize: '1rem'}}>Contact Info</h3>
                            <div className="text-light">
                                <div className="mb-3">
                                    <div className="d-flex align-items-start mb-2">
                                        <i className="bi bi-geo-alt-fill me-2 mt-1 text-warning"></i>
                                        <div className="small">
                                            123 Fashion Street<br />
                                            New York, NY 10001
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <div className="d-flex align-items-center mb-1">
                                        <i className="bi bi-telephone-fill me-2 text-warning"></i>
                                        <span className="small">+1 (555) 123-4567</span>
                                    </div>
                                </div>
                                
                                <div className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-envelope-fill me-2 text-warning"></i>
                                        <span className="small">info@luxeboutique.com</span>
                                    </div>
                                </div>

                                <div className="small text-light opacity-75">
                                    <strong>Store Hours:</strong><br />
                                    Mon-Fri: 10:00-22:00<br />
                                    Sat: 10:00-20:00<br />
                                    Sun: 12:00-18:00
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-top border-secondary py-3" style={{
                background: '#1a1a1a'
            }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
                            <p className="mb-0 small text-light opacity-75">
                                © {currentYear} Luxe Boutique. All rights reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <div className="d-flex justify-content-center justify-content-md-end gap-3">
                                <a href="#" className="footer-link text-light text-decoration-none small">
                                    Terms of Service
                                </a>
                                <span className="text-secondary">|</span>
                                <a href="#" className="footer-link text-light text-decoration-none small">
                                    Privacy Policy
                                </a>
                                <span className="text-secondary">|</span>
                                <a href="#" className="footer-link text-light text-decoration-none small">
                                    Cookies
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;