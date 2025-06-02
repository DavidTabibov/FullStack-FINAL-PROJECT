import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';

function Logo() {
    return (
        <Link to="/" className="text-decoration-none d-flex align-items-center">
            <div
                className="d-flex align-items-center justify-content-center rounded-circle bg-primary me-2"
                style={{ width: '40px', height: '40px' }}
            >
                <FaUtensils className="text-white" />
            </div>
            <span className="fw-bold text-white fs-4">מתכונים שלנו</span>
        </Link>
    );
}

export default Logo;