import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';

function Logo() {
    return (
        <Link to="/" className="logo-container">
            <div className="logo">
                <FaUtensils className="logo-icon" />
                <span className="logo-text">מתכונים שלנו</span>
            </div>
        </Link>
    );
}

export default Logo;