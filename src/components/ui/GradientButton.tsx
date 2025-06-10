import React from 'react';
import { cn } from '../../utils/cn';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function GradientButton({ 
  variant = 'primary', 
  fullWidth = false,
  size = 'md',
  className,
  children,
  ...props 
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400 text-white hover:from-amber-500 hover:via-rose-500 hover:to-amber-500 hover:shadow-lg',
    secondary: 'bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 text-amber-700 border border-amber-200 hover:border-amber-300 hover:from-amber-100 hover:via-rose-100 hover:to-amber-100',
    outline: 'bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
  };

  return (
    <button
      className={cn(
        'rounded-lg font-medium transition-all duration-200 disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}