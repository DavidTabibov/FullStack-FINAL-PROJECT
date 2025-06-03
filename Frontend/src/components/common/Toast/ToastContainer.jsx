import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '../../../context/ToastContext';

const ToastContainer = () => {
  const { toasts, removeToast, setFadeOutCallback } = useToast();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [fadingToasts, setFadingToasts] = useState(new Set());

  // Track scroll position
  useEffect(() => {
    const updateScrollPosition = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', updateScrollPosition);
    updateScrollPosition(); // Initial position

    return () => window.removeEventListener('scroll', updateScrollPosition);
  }, []);

  const handleRemoveToast = (toastId) => {
    // Start fade-out animation
    setFadingToasts(prev => new Set([...prev, toastId]));
    
    // Remove after animation completes
    setTimeout(() => {
      removeToast(toastId);
      setFadingToasts(prev => {
        const newSet = new Set(prev);
        newSet.delete(toastId);
        return newSet;
      });
    }, 300); // Match animation duration
  };

  // Register fade-out handler with context for auto-dismiss
  useEffect(() => {
    setFadeOutCallback(handleRemoveToast);
  }, [setFadeOutCallback]);

  if (toasts.length === 0) return null;

  const getToastColor = (type) => {
    switch (type) {
      case 'success':
        return { bg: '#10b981', border: '#34d399' };
      case 'error':
        return { bg: '#ef4444', border: '#f87171' };
      case 'warning':
        return { bg: '#f59e0b', border: '#fbbf24' };
      case 'info':
      default:
        return { bg: '#3b82f6', border: '#60a5fa' };
    }
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const containerStyle = {
    position: 'absolute',
    top: `${scrollPosition + 20}px`, // Position relative to current scroll
    right: '20px',
    zIndex: 999999,
    maxWidth: '350px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px'
  };

  const toastContent = (
    <div style={containerStyle}>
      {toasts.map((toast, index) => {
        const colors = getToastColor(toast.type);
        const isFading = fadingToasts.has(toast.id);
        
        const toastStyle = {
          background: colors.bg,
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '10px',
          borderLeft: `4px solid ${colors.border}`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: '300px',
          animation: isFading 
            ? 'fadeOutToRight 0.3s ease-in forwards' 
            : 'slideInFromRight 0.3s ease-out',
          transition: 'all 0.3s ease'
        };

        const iconStyle = {
          fontSize: '18px',
          marginRight: '12px',
          fontWeight: 'bold'
        };

        const closeButtonStyle = {
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '0',
          marginLeft: '12px',
          lineHeight: '1'
        };

        return (
          <div key={toast.id} style={toastStyle}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <span style={iconStyle}>{getToastIcon(toast.type)}</span>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                  {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
                </div>
                <div>{toast.message}</div>
              </div>
            </div>
            <button
              style={closeButtonStyle}
              onClick={() => handleRemoveToast(toast.id)}
              onMouseOver={(e) => e.target.style.opacity = '0.7'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              ×
            </button>
          </div>
        );
      })}
      
      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOutToRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );

  // Render directly to document.body
  return createPortal(toastContent, document.body);
};

export default ToastContainer; 