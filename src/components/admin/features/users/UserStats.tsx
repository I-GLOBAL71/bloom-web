import React from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Clock } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export function UserStats() {
  const { users } = useUserStore();

  const stats = [
    {
      label: 'Utilisateurs Actifs',
      value: users.filter(u => u.status === 'active').length,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      label: 'Matchs Aujourd\'hui',
      value: users.reduce((acc, user) => acc + user.matches, 0),
      icon: Heart,
      color: 'text-pink-500'
    },
    {
      label: 'Temps Moyen',
      value: '24min',
      icon: Clock,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="bg-white p-6 rounded-lg shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-opacity-10 ${stat.color.replace('text', 'bg')}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
          <p className="text-gray-600 text-sm">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}