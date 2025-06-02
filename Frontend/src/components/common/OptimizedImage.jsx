import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  placeholder = 'blur',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px', // Reduced for better performance
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Reset state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setCurrentSrc(src);
  }, [src]);

  // Generate optimized image URLs
  const generateOptimizedSrc = (originalSrc, width, height) => {
    if (!originalSrc) return 'https://picsum.photos/400/300?random=default';
    
    // If it's already a picsum URL, just return it
    if (originalSrc.includes('picsum.photos')) return originalSrc;
    
    // If it's an unsplash URL, optimize it
    if (originalSrc.includes('unsplash.com')) {
      const baseUrl = originalSrc.split('?')[0];
      const params = new URLSearchParams();
      
      if (width) params.set('w', Math.min(width, 1200));
      if (height) params.set('h', Math.min(height, 800));
      params.set('fit', 'crop');
      params.set('auto', 'format,compress');
      params.set('q', '80');
      
      return `${baseUrl}?${params.toString()}`;
    }
    
    // For other URLs, return as-is
    return originalSrc;
  };

  // Generate fallback image based on category
  const generateFallbackSrc = (alt, width = 400, height = 300) => {
    
    if (alt?.toLowerCase().includes('kids') || alt?.toLowerCase().includes('children')) {
      // Use better kids clothing images instead of random stock photos
      const kidsImages = [
        'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&h=600&fit=crop&crop=center', // Kids clothing store
        'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&h=600&fit=crop&crop=center', // Kids shoes
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=600&fit=crop&crop=center', // Kids fashion
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&crop=center'  // Colorful kids dress
      ];
      const randomIndex = Math.floor(Math.random() * kidsImages.length);
      return kidsImages[randomIndex];
    } else if (alt?.toLowerCase().includes('men') || alt?.toLowerCase().includes('male')) {
      return `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=${width}&h=${height}&fit=crop&crop=center`;
    } else if (alt?.toLowerCase().includes('women') || alt?.toLowerCase().includes('female')) {
      return `https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=${width}&h=${height}&fit=crop&crop=center`;
    } else if (alt?.toLowerCase().includes('accessories')) {
      return `https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=${width}&h=${height}&fit=crop&crop=center`;
    }
    
    return `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=${width}&h=${height}&fit=crop&crop=center`;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    if (!hasError && currentSrc !== generateFallbackSrc(alt, width, height)) {
      // Try fallback image first
      setCurrentSrc(generateFallbackSrc(alt, width, height));
      setHasError(false);
    } else {
      // Show styled fallback
      setHasError(true);
      setIsLoaded(true);
    }
  };

  const optimizedSrc = generateOptimizedSrc(currentSrc, width, height);

  return (
    <div
      ref={imgRef}
      className={`position-relative overflow-hidden ${className}`}
      style={{ 
        width: '100%', 
        height: '100%',
        ...props.style 
      }}
    >
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: 'linear-gradient(45deg, #f8f9fa 25%, transparent 25%), linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8f9fa 75%), linear-gradient(-45deg, transparent 75%, #f8f9fa 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            animation: 'shimmer 1.5s infinite linear'
          }}
        >
          <div className="text-muted">
            <i className="bi bi-image fs-4 opacity-50"></i>
          </div>
        </div>
      )}

      {/* Error fallback with beautiful gradients */}
      {hasError && (
        <div 
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: alt?.toLowerCase().includes('kids') || alt?.toLowerCase().includes('children')
              ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)'
              : alt?.toLowerCase().includes('men') || alt?.toLowerCase().includes('male')
              ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #374151 100%)'
              : alt?.toLowerCase().includes('women') || alt?.toLowerCase().includes('female')
              ? 'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #be185d 100%)'
              : alt?.toLowerCase().includes('accessories')
              ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)'
              : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)'
          }}
        >
          <div className="text-center text-white">
            <i className="bi bi-images fs-1 mb-3 d-block opacity-80"></i>
            <h6 className="fw-bold mb-1">
              {alt?.toLowerCase().includes('kids') ? "Kids' Collection" : 
               alt?.toLowerCase().includes('men') ? "Men's Fashion" :
               alt?.toLowerCase().includes('women') ? "Women's Fashion" :
               alt?.toLowerCase().includes('accessories') ? "Accessories" :
               'Fashion Item'}
            </h6>
            <p className="small mb-0 opacity-75">Premium Quality</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {(isInView || priority) && !hasError && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-100 h-100 transition-opacity ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transition: 'opacity 0.3s ease',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      )}
    </div>
  );
};

export default OptimizedImage; 