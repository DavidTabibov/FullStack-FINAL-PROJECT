import React from 'react';
import { useToast } from '../../../context/ToastContext';
import './Toast.css';

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-x-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'info':
      default:
        return 'bi-info-circle-fill';
    }
  };

  const getToastClass = (type) => {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      case 'info':
      default:
        return 'toast-info';
    }
  };

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast show mb-2 border-0 shadow-lg ${getToastClass(toast.type)}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header bg-transparent border-0 pb-1">
            <i className={`${getToastIcon(toast.type)} me-2`}></i>
            <strong className="me-auto text-white">
              {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
            </strong>
            <button
              type="button"
              className="btn-close btn-close-white ms-2 m-auto"
              onClick={() => removeToast(toast.id)}
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body text-white pt-0">
            {toast.message}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer; 