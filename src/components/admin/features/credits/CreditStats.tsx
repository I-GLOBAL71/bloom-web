import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TrendingUp, Gift, Users } from 'lucide-react';

export function CreditStats() {
  const stats = [
    {
      label: 'Revenus du Mois',
      value: '12,845€',
      change: '+15%',
      icon: CreditCard,
      color: 'text-green-500'
    },
    {
      label: 'Pétales en Circulation',
      value: '1.2M',
      change: '+8%',
      icon: Gift,
      color: 'text-pink-500'
    },
    {
      label: 'Taux de Conversion',
      value: '8.5%',
      change: '+2%',
      icon: TrendingUp,
      color: 'text-blue-500'
    },
    {
      label: 'Utilisateurs Premium',
      value: '1,245',
      change: '+12%',
      icon: Users,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <span className={`text-sm font-medium ${
              stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
            }`}>
              {stat.change}
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
          <p className="text-gray-600 text-sm">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}