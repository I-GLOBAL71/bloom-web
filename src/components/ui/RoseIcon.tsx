import React from 'react';
import { GiRose } from 'react-icons/gi';
import { BiLeaf } from 'react-icons/bi';

interface RoseIconProps {
  size?: number;
  className?: string;
}

export const RoseIcon: React.FC<RoseIconProps> = ({ size = 24, className = '' }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      {/* Rose principale */}
      <GiRose 
        size={size} 
        className="text-red-700" 
        style={{ 
          filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))'
        }}
      />
      
      {/* Feuille décorative */}
      <BiLeaf 
        size={size * 0.5} 
        className="text-green-600 absolute -bottom-1 -right-1" 
        style={{ 
          filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))',
          transform: 'rotate(45deg)'
        }}
      />
    </span>
  );
};