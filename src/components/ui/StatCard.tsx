import React from 'react';
import { motion } from 'framer-motion';
import { scaleIn } from '../animations/variants';

interface StatCardProps {
  number: string;
  text: string;
}

export function StatCard({ number, text }: StatCardProps) {
  return (
    <motion.div 
      className="p-8 rounded-2xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-sm"
      variants={scaleIn}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent mb-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {number}
      </motion.div>
      <motion.div 
        className="text-gray-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {text}
      </motion.div>
    </motion.div>
  );
}