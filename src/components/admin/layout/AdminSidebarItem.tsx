import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface AdminSidebarItemProps {
  id: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function AdminSidebarItem({ icon: Icon, label, isActive, onClick }: AdminSidebarItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg
        ${isActive 
          ? 'bg-pink-50 text-pink-600' 
          : 'hover:bg-pink-50 text-gray-700 hover:text-pink-600'
        }
      `}
      whileHover={{ x: 5 }}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </motion.button>
  );
}