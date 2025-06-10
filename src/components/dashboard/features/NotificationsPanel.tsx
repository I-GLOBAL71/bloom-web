import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Heart, MessageCircle, Star } from 'lucide-react';

export function NotificationsPanel() {
  const notifications = [
    {
      id: 1,
      type: 'match',
      message: 'Nouveau match avec Sophie !',
      time: '5 min',
      icon: Heart,
      color: 'text-pink-500'
    },
    {
      id: 2,
      type: 'message',
      message: 'Marie vous a envoyé un message',
      time: '10 min',
      icon: MessageCircle,
      color: 'text-blue-500'
    }
  ];

  return (
    <motion.div
      className="w-80 bg-white/80 backdrop-blur-md shadow-lg p-4"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <Bell className="w-5 h-5 text-gray-500" />
      </div>
      
      <div className="space-y-4">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className="p-3 bg-white rounded-lg shadow-sm"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start gap-3">
              <notification.icon className={`w-5 h-5 ${notification.color}`} />
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                <span className="text-xs text-gray-500">{notification.time}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}