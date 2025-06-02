import React from 'react';

const Loading = ({ 
  type = 'page', // 'page', 'component', 'image', 'skeleton'
  size = 'medium', // 'small', 'medium', 'large'
  text = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    small: 'spinner-border-sm',
    medium: '',
    large: 'spinner-border-custom'
  };

  if (type === 'skeleton') {
    return (
      <div className={`animate-shimmer ${className}`}>
        <div className="bg-light rounded h-100 mb-3" style={{height: '16rem'}}></div>
        <div>
          <div className="bg-light rounded mb-2" style={{height: '1rem', width: '75%'}}></div>
          <div className="bg-light rounded" style={{height: '1rem', width: '50%'}}></div>
        </div>
      </div>
    );
  }

  if (type === 'page') {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="d-flex justify-content-center mb-4">
            <div className={`spinner-border text-primary ${sizeClasses.large}`} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <p className="fs-5 text-muted fw-medium">{text}</p>
          <p className="small text-muted mt-2">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  if (type === 'component') {
    return (
      <div className={`d-flex align-items-center justify-content-center p-4 ${className}`}>
        <div className="text-center">
          <div className="d-flex justify-content-center mb-2">
            <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <p className="small text-muted">{text}</p>
        </div>
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div className={`bg-light animate-shimmer rounded ${className}`}>
        <div className="d-flex align-items-center justify-content-center h-100">
          <i className="bi bi-image fs-2 text-muted"></i>
        </div>
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`d-flex align-items-center justify-content-center ${className}`}>
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

// Higher-order component for loading states
export const withLoading = (WrappedComponent, loadingProps = {}) => {
  return function LoadingComponent(props) {
    if (props.loading) {
      return <Loading {...loadingProps} />;
    }
    return <WrappedComponent {...props} />;
  };
};

// Suspense boundary wrapper
export const SuspenseWrapper = ({ 
  children, 
  fallback = <Loading type="page" />,
  errorBoundary = true 
}) => {
  if (errorBoundary) {
    return (
      <React.Suspense fallback={fallback}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </React.Suspense>
    );
  }

  return (
    <React.Suspense fallback={fallback}>
      {children}
    </React.Suspense>
  );
};

// Simple Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Loading Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
          <div className="text-center">
            <div className="display-1 mb-4">😵</div>
            <h2 className="h3 fw-bold text-dark mb-2">Something went wrong</h2>
            <p className="text-muted mb-4">We're sorry, but there was an error loading this page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default Loading; 