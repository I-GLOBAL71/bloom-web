import { useState, useCallback, useEffect } from 'react';

interface ImageCache {
  [key: string]: string;
}

interface ImageDimensions {
  width: number;
  height: number;
}

interface ImageCacheOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

interface UseImageCacheResult {
  getImage: (url: string, fallbackText: string, options?: ImageCacheOptions) => string;
  preloadImages: (urls: string[], options?: ImageCacheOptions) => void;
  isLoading: (url: string) => boolean;
}

// Global rate limiting state
const BACKOFF_TIME = 2000; // Increased to 2 seconds
const MAX_RETRIES = 2; // Reduced retries to avoid rate limits
const EXPONENTIAL_BACKOFF_FACTOR = 2;
let lastRequestTime = 0;
let retryTimeouts: { [key: string]: NodeJS.Timeout } = {};
let retryCount: { [key: string]: number } = {};
let imageCache = new Map<string, string>();

// Default fallback image URL (replace with your actual fallback image)
const DEFAULT_FALLBACK_IMAGE = 'https://via.placeholder.com/400x400?text=Profile+Image';

// Helper function to validate and resize image if needed
const processImage = async (blob: Blob, options?: ImageCacheOptions): Promise<Blob> => {
  if (!options) return blob;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const { width, height } = img;
      const { maxWidth = width, maxHeight = height, quality = 0.8 } = options;
      
      // Check if resizing is needed
      if (width <= maxWidth && height <= maxHeight) {
        resolve(blob);
        return;
      }

      // Calculate new dimensions maintaining aspect ratio
      let newWidth = width;
      let newHeight = height;
      const aspectRatio = width / height;

      if (width > maxWidth) {
        newWidth = maxWidth;
        newHeight = maxWidth / aspectRatio;
      }
      
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = maxHeight * aspectRatio;
      }

      // Create canvas for resizing
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(blob);
        return;
      }

      // Draw image with smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Convert to blob
      canvas.toBlob(
        (resizedBlob) => resolve(resizedBlob || blob),
        'image/jpeg',
        quality
      );
    };

    img.src = url;
  });
};

// Helper function to handle Google profile images
const handleGoogleImage = (url: string): string => {
  if (!url.includes('googleusercontent.com')) return url;
  
  // Extract the base URL and ID
  const matches = url.match(/\/a\/([^=]+)/);
  if (!matches) return url;
  
  // Create a data URL for the profile picture
  const id = matches[1];
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#e0e0e0"/>
      <text x="200" y="220" font-family="Arial" font-size="100" text-anchor="middle" fill="#757575">
        ${id.charAt(0).toUpperCase()}
      </text>
    </svg>`
  )}`;
};

// Helper function to create initials avatar
const createInitialsAvatar = (text: string): string => {
  const initial = text.charAt(0).toUpperCase();
  const colors = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];
  const colorIndex = text.charCodeAt(0) % colors.length;
  const backgroundColor = colors[colorIndex];
  
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="${backgroundColor}"/>
      <text x="200" y="220" font-family="Arial" font-size="180" text-anchor="middle" fill="white">
        ${initial}
      </text>
    </svg>`
  )}`;
};

// Helper function to check if URL is proxied
const isProxiedUrl = (url: string): boolean => {
  return url.startsWith('/api/proxy') || url.startsWith('http://localhost');
};

export function useImageCache(): UseImageCacheResult {
  const [cache, setCache] = useState<ImageCache>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const canMakeRequest = useCallback(() => {
    const now = Date.now();
    if (now - lastRequestTime >= BACKOFF_TIME) {
      lastRequestTime = now;
      return true;
    }
    return false;
  }, []);

  const calculateBackoffTime = useCallback((retryAttempt: number) => {
    return BACKOFF_TIME * Math.pow(EXPONENTIAL_BACKOFF_FACTOR, retryAttempt - 1);
  }, []);

  const fetchImage = useCallback(async (url: string, options?: ImageCacheOptions): Promise<string | null> => {
    // Check in-memory cache first
    const cachedImage = imageCache.get(url);
    if (cachedImage) {
      return cachedImage;
    }

    if (!canMakeRequest()) {
      return new Promise(resolve => {
        const timeout = setTimeout(() => {
          fetchImage(url, options).then(resolve);
        }, BACKOFF_TIME);
        retryTimeouts[url] = timeout;
      });
    }

    retryCount[url] = (retryCount[url] || 0) + 1;
    if (retryCount[url] > MAX_RETRIES) {
      console.warn(`Max retries reached for ${url}`);
      delete retryCount[url];
      
      // For Google images, return an initials-based avatar
      if (url.includes('googleusercontent.com')) {
        const avatar = createInitialsAvatar(url);
        imageCache.set(url, avatar);
        return avatar;
      }
      
      return DEFAULT_FALLBACK_IMAGE;
    }

    try {
      const isGoogleImage = url.includes('googleusercontent.com');
      
      // For Google images, return an SVG avatar immediately
      if (isGoogleImage) {
        const avatar = handleGoogleImage(url);
        imageCache.set(url, avatar);
        delete retryCount[url];
        return avatar;
      }

      // For non-Google images, proceed with normal fetch
      const response = await fetch(url, {
        headers: {
          'Accept': 'image/webp,image/jpeg,image/*',
          'Cache-Control': 'max-age=3600',
        },
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const processedBlob = await processImage(blob, options);
      const objectUrl = URL.createObjectURL(processedBlob);
      
      imageCache.set(url, objectUrl);
      delete retryCount[url];
      return objectUrl;

    } catch (error) {
      console.error('Error fetching image:', error);
      
      if (retryCount[url] >= MAX_RETRIES) {
        // For Google images, return an initials-based avatar
        if (url.includes('googleusercontent.com')) {
          const avatar = createInitialsAvatar(url);
          imageCache.set(url, avatar);
          return avatar;
        }
        
        return DEFAULT_FALLBACK_IMAGE;
      }
      
      const backoffTime = calculateBackoffTime(retryCount[url]);
      return new Promise(resolve => {
        const timeout = setTimeout(() => {
          fetchImage(url, options).then(resolve);
        }, backoffTime);
        retryTimeouts[url] = timeout;
      });
    }
  }, [canMakeRequest, calculateBackoffTime]);

  const getImage = useCallback((url: string, fallbackText: string, options?: ImageCacheOptions): string => {
    const cachedUrl = cache[url];
    if (cachedUrl) {
      return cachedUrl;
    }

    if (!loading[url]) {
      setLoading(prev => ({ ...prev, [url]: true }));
      fetchImage(url, options).then(result => {
        if (result) {
          setCache(prev => ({ ...prev, [url]: result }));
        }
        setLoading(prev => ({ ...prev, [url]: false }));
      });
    }

    return DEFAULT_FALLBACK_IMAGE;
  }, [cache, loading, fetchImage]);

  const preloadImages = useCallback((urls: string[], options?: ImageCacheOptions) => {
    urls.forEach(url => {
      if (!cache[url] && !loading[url]) {
        setLoading(prev => ({ ...prev, [url]: true }));
        fetchImage(url, options).then(result => {
          if (result) {
            setCache(prev => ({ ...prev, [url]: result }));
          }
          setLoading(prev => ({ ...prev, [url]: false }));
        });
      }
    });
  }, [cache, loading, fetchImage]);

  const isLoading = useCallback((url: string): boolean => {
    return loading[url] || false;
  }, [loading]);

  // Cleanup function
  useEffect(() => {
    return () => {
      Object.values(retryTimeouts).forEach(timeout => clearTimeout(timeout));
      retryTimeouts = {};
      retryCount = {};
    };
  }, []);

  return { getImage, preloadImages, isLoading };
}
