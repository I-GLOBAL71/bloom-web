import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export function MatchesDrawer() {
  const matches = [
    {
      id: '1',
      name: 'Sophie',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      lastActive: 'Il y a 5 min'
    },
    // Add more matches
  ];

  return (
    <motion.div
      className="w-80 bg-white/80 backdrop-blur-md shadow-lg p-6"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Heart className="w-5 h-5 text-pink-500" />
        Vos matchs
      </h2>

      <div className="space-y-4">
        {matches.map(match => (
          <motion.div
            key={match.id}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={match.photo}
              alt={match.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium">{match.name}</h3>
              <p className="text-sm text-gray-500">{match.lastActive}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}