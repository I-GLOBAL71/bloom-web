import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useImageCache } from '../../hooks/useImageCache';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12'
};

export function Avatar({ 
  src, 
  alt, 
  size = 'md', 
  className = '',
  onClick
}: AvatarProps) {
  const { getImage } = useImageCache();
  const [error, setError] = useState(false);

  const handleError = () => {
    console.warn('Failed to load avatar image:', src);
    setError(true);
  };

  const imageUrl = src && !error ? getImage(src, alt) : null;

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      onClick={onClick}
    >
      <img
        src={imageUrl || `data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
            <rect width="40" height="40" fill="#e2e8f0"/>
            <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#64748b" dominant-baseline="middle" text-anchor="middle">
              ${alt.charAt(0).toUpperCase()}
            </text>
          </svg>`
        )}`}
        alt={alt}
        className={`w-full h-full rounded-full object-cover ${onClick ? 'cursor-pointer' : ''}`}
        onError={handleError}
      />
    </motion.div>
  );
}
