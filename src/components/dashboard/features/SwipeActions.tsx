import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart } from 'lucide-react';

interface SwipeActionsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  disabled?: boolean;
}

export function SwipeActions({ onSwipeLeft, onSwipeRight, disabled = false }: SwipeActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <motion.button
        onClick={onSwipeLeft}
        className="p-4 rounded-full bg-white shadow-lg text-gray-400 hover:text-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={disabled}
      >
        <X className="w-8 h-8" />
      </motion.button>

      <motion.button
        onClick={onSwipeRight}
        className="p-4 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={disabled}
      >
        <Heart className="w-8 h-8" />
      </motion.button>
    </div>
  );
}