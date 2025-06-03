import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTopOnRouteChange = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash (like #faq), scroll to that element
    if (hash) {
      // Small delay to ensure the page has loaded
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else {
      // No hash, scroll to top
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use instant for page changes
      });
    }
  }, [pathname, hash]);

  return null; // This component doesn't render anything
};

export default ScrollToTopOnRouteChange; 