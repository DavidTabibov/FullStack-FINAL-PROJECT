import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';

function NotFoundPage() {
    return (
        <div className="container py-5">
            <div className="row justify-content-center text-center">
                <div className="col-md-6">
                    <h1 className="display-1 text-primary mb-4">404</h1>
                    <h2 className="mb-4">Page Not Found</h2>
                    <p className="text-muted mb-4">
                        Sorry, but the page you are looking for was not found.
                        It might have been removed or the link you came from is incorrect.
                    </p>

                    <div className="d-flex justify-content-center gap-3">
                        <Link
                            to="/"
                            className="btn btn-primary"
                        >
                            <FaHome className="me-2" />
                            Back to Home
                        </Link>
                        <Link
                            to="/products"
                            className="btn btn-outline-primary"
                        >
                            <FaSearch className="me-2" />
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;