import React from 'react';
import { motion } from 'framer-motion';
import { Flower, Crown, Star } from 'lucide-react';

export function Credits() {
  return (
    <div className="p-4 bg-white/80 backdrop-blur-md rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Vos Pétales</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flower className="text-pink-500 w-5 h-5" />
          <span className="font-medium">250 pétales</span>
        </div>
        <motion.button
          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Obtenir plus
        </motion.button>
      </div>
    </div>
  );
}