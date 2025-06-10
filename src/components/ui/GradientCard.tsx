import React, { forwardRef } from 'react';

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const GradientCard = forwardRef<HTMLDivElement, GradientCardProps>(
  ({ children, className = '', style }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`
          relative overflow-hidden rounded-2xl
          bg-gradient-to-br from-pink-50/90 to-white/95
          backdrop-blur-xl shadow-xl
          border border-pink-100/20
          ${className}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/20 to-transparent" />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

GradientCard.displayName = 'GradientCard';