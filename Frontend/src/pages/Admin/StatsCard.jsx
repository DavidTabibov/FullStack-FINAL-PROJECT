import React from 'react';

function StatsCard({ icon, title, value, color, loading }) {
    return (
        <div className="card border-0 shadow-sm h-100 card-hover">
            <div className="card-body text-center p-4">
                <div className={`rounded-circle ${color} d-inline-flex align-items-center justify-content-center mb-3`} style={{width: '64px', height: '64px'}}>
                    <i className={`${icon} fs-2 text-white`}></i>
                </div>
                <h5 className="card-title fw-bold text-dark mb-2">{title}</h5>
                {loading ? (
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                ) : (
                    <p className="card-text h4 fw-bold text-primary mb-0">{value}</p>
                )}
            </div>
        </div>
    );
}

export default StatsCard;