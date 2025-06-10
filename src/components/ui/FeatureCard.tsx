import React from 'react';
import { motion } from 'framer-motion';
import { scaleIn } from '../animations/variants';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div 
      className="p-8 rounded-2xl bg-white/70 backdrop-blur-sm shadow-xl"
      variants={scaleIn}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
    >
      <motion.div 
        className="bg-gradient-to-br from-pink-100 to-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}