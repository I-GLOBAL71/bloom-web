import React, { memo } from 'react';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

// Utiliser memo pour éviter les re-rendus inutiles
const Logo = memo(({ className = '', onClick }: LogoProps) => {
  // ID unique pour les gradients, créé une seule fois par instance
  const uniqueId = React.useMemo(() => `logo-${Date.now()}`, []);
  
  return (
    <svg
      key={uniqueId}
      width="160"
      height="160"
      viewBox="0 0 80 80"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      style={{ isolation: 'isolate', display: 'block' }}
    >
      <defs>
        <linearGradient id={`petalGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff8fb1" />
          <stop offset="100%" stopColor="#ff6b6b" />
        </linearGradient>
        <linearGradient id={`bloomGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FF85B3" />
          <stop offset="100%" stopColor="#FF69B4" />
        </linearGradient>
      </defs>
      
      {/* Groupe de la fleur */}
      <g transform="translate(40, 32)">
        {/* Pétales fixes */}
        {[0, 72, 144, 216, 288].map((angle) => (
          <path
            key={`petal-${angle}-${uniqueId}`}
            d="M0,-15 C7,-15 15,-7 15,0 C15,7 7,15 0,15 C-7,15 -15,7 -15,0 C-15,-7 -7,-15 0,-15"
            fill={`url(#petalGradient-${uniqueId})`}
            opacity="0.9"
            transform={`rotate(${angle})`}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        ))}
        
=======
      </g>

      {/* Texte "Bloom" */}
      <text
        x="40"
        y="58"
        fontFamily="Arial, sans-serif"
        fontSize="18"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={`url(#bloomGradient-${uniqueId})`}
        style={{ userSelect: 'none' }}
      >
        Bloomeet
      </text>
    </svg>
  );
});

Logo.displayName = 'Logo';

export { Logo };