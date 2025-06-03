import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(0);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
      // Position button relative to current scroll position
      setButtonPosition(window.pageYOffset + window.innerHeight - 80);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll to top"
          title="Back to top"
          style={{
            position: 'absolute',
            top: `${buttonPosition}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '50px',
            height: '50px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
            transition: 'all 0.3s ease'
          }}
        >
          <i className="bi bi-arrow-up"></i>
        </button>
      )}
    </>
  );
};

export default ScrollToTop; 