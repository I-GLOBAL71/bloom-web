import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, Star, Flower } from 'lucide-react';

export function UserStats() {
  const stats = [
    { label: 'Matchs', value: 24, icon: Heart, color: 'text-pink-500' },
    { label: 'Vues', value: 156, icon: Eye, color: 'text-blue-500' },
    { label: 'Super Likes', value: 8, icon: Star, color: 'text-amber-500' },
    { label: 'Pétales', value: 250, icon: Flower, color: 'text-green-500' }
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          className="p-2 bg-white/80 backdrop-blur-md rounded-lg shadow-sm text-center"
          whileHover={{ scale: 1.05 }}
        >
          <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
          <p className="text-xs font-medium">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}