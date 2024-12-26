import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AuthMethodButtonProps {
  icon: React.ReactNode;
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function AuthMethodButton({ 
  icon, 
  label, 
  selected, 
  disabled, 
  onClick 
}: AuthMethodButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        p-4 rounded-xl border-2 flex flex-col items-center gap-2
        ${selected 
          ? 'border-pink-500 bg-pink-50' 
          : 'border-pink-200 hover:border-pink-300 hover:bg-pink-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      {React.cloneElement(icon as React.ReactElement, { 
        className: `w-6 h-6 ${selected ? 'text-pink-500' : 'text-gray-400'}`
      })}
      <span className="text-sm">{label}</span>
    </motion.button>
  );
}