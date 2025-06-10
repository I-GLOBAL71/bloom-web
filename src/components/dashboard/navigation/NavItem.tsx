import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function NavItem({ icon: Icon, label, active, onClick }: NavItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center p-2 rounded-xl
        ${active 
          ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-white' 
          : 'text-gray-400 hover:bg-pink-50 hover:text-pink-500'
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs mt-1 font-medium">{label}</span>
    </motion.button>
  );
}