import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export function MatchesSection() {
  const matches = [
    {
      id: '1',
      name: 'Sophie',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      lastActive: '5 min',
      compatibility: 85
    },
    {
      id: '2',
      name: 'Marie',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      lastActive: '1 h',
      compatibility: 92
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Heart className="w-8 h-8 text-pink-500" />
        <h1 className="text-3xl font-bold">Vos Matchs</h1>
      </motion.div>

      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {matches.map(match => (
          <motion.div
            key={match.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={match.photo}
              alt={match.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{match.name}</h3>
                <span className="text-sm font-medium text-pink-500">
                  {match.compatibility}% compatible
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Actif il y a {match.lastActive}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
