import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [fadeOutToast, setFadeOutToast] = useState(null);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        // Trigger fade-out callback if it exists
        if (fadeOutToast) {
          fadeOutToast(id);
        } else {
          // Fallback to direct removal
          removeToast(id);
        }
      }, duration);
    }

    return id;
  }, [fadeOutToast]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const setFadeOutCallback = useCallback((callback) => {
    setFadeOutToast(() => callback);
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAll,
    setFadeOutCallback,
    // Convenience methods
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration),
    // Alias for backward compatibility
    showToast: (message, type = 'success', duration) => addToast(message, type, duration),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}; 